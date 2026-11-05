import { createPublicKey, JsonWebKey, KeyObject } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ServiceUnavailableError, UnauthorizedError } from '../../shared/errors';
import { logger } from '../../shared/utils/logger.util';

export interface ClerkIdentity {
  clerkUserId: string;
  /** Primary email address, verified by Clerk, lower-cased. */
  email: string;
  name?: string;
  phone?: string;
}

type Jwk = JsonWebKey & { kid?: string };

interface ClerkEmailAddress {
  id: string;
  email_address: string;
  verification?: { status?: string } | null;
}

interface ClerkUser {
  first_name?: string | null;
  last_name?: string | null;
  banned?: boolean;
  locked?: boolean;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
  primary_phone_number_id?: string | null;
  phone_numbers?: Array<{ id: string; phone_number: string }>;
}

const CLERK_API_URL = 'https://api.clerk.com/v1';
const JWKS_TTL_MS = 60 * 60 * 1000;
// A token naming an unknown key id triggers at most one JWKS refetch per minute.
const JWKS_REFETCH_COOLDOWN_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;
const CLERK_USER_ID = /^user_[A-Za-z0-9]+$/;

/**
 * Proves who a Clerk session belongs to, so the API never trusts an email address sent by the browser.
 * The session JWT is checked against Clerk's public keys; the user's email is then read from Clerk itself.
 */
export class ClerkService {
  private keys = new Map<string, KeyObject>();
  private keysFetchedAt = 0;

  async verifySession(authorization: string | undefined): Promise<ClerkIdentity> {
    if (!env.clerk.isConfigured) {
      throw new ServiceUnavailableError('Sign-in is not fully configured on the server', 'CLERK_NOT_CONFIGURED');
    }

    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    if (!token) {
      throw new UnauthorizedError('Clerk session token is required', 'CLERK_TOKEN_REQUIRED');
    }

    const clerkUserId = await this.verifyToken(token);
    return this.fetchIdentity(clerkUserId);
  }

  private async verifyToken(token: string): Promise<string> {
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded && typeof decoded !== 'string' ? decoded.header.kid : undefined;
    if (!kid) {
      throw new UnauthorizedError('Invalid Clerk session token', 'CLERK_TOKEN_INVALID');
    }

    const key = await this.getKey(kid);
    let claims: JwtPayload;
    try {
      claims = jwt.verify(token, key, {
        algorithms: ['RS256'],
        issuer: env.clerk.issuer,
        clockTolerance: 5,
      }) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired Clerk session', 'CLERK_TOKEN_INVALID');
    }

    if (typeof claims.sub !== 'string' || !CLERK_USER_ID.test(claims.sub)) {
      throw new UnauthorizedError('Invalid Clerk session token', 'CLERK_TOKEN_INVALID');
    }
    return claims.sub;
  }

  private async getKey(kid: string): Promise<KeyObject> {
    const age = Date.now() - this.keysFetchedAt;
    const cached = this.keys.get(kid);
    if (cached && age < JWKS_TTL_MS) return cached;

    if (age >= JWKS_REFETCH_COOLDOWN_MS) {
      await this.refreshKeys();
    }
    const key = this.keys.get(kid);
    if (!key) {
      throw new UnauthorizedError('Invalid Clerk session token', 'CLERK_TOKEN_INVALID');
    }
    return key;
  }

  private async refreshKeys(): Promise<void> {
    try {
      const res = await fetch(`${env.clerk.issuer}/.well-known/jwks.json`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`JWKS request failed with ${res.status}`);
      const body = (await res.json()) as { keys?: Jwk[] };
      const next = new Map<string, KeyObject>();
      for (const jwk of body.keys ?? []) {
        if (jwk.kty === 'RSA' && jwk.kid) {
          next.set(jwk.kid, createPublicKey({ key: jwk, format: 'jwk' }));
        }
      }
      this.keys = next;
      this.keysFetchedAt = Date.now();
    } catch (err) {
      logger.error('Could not load Clerk signing keys', { error: (err as Error).message });
      throw new ServiceUnavailableError('Could not verify sign-in right now', 'CLERK_UNAVAILABLE');
    }
  }

  private async fetchIdentity(clerkUserId: string): Promise<ClerkIdentity> {
    let res: Response;
    try {
      res = await fetch(`${CLERK_API_URL}/users/${clerkUserId}`, {
        headers: { Authorization: `Bearer ${env.clerk.secretKey}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      logger.error('Clerk user lookup failed', { error: (err as Error).message });
      throw new ServiceUnavailableError('Could not verify sign-in right now', 'CLERK_UNAVAILABLE');
    }

    if (res.status === 404) {
      throw new UnauthorizedError('Clerk user not found', 'CLERK_TOKEN_INVALID');
    }
    if (!res.ok) {
      // 401/403 here means CLERK_SECRET_KEY is wrong or belongs to another Clerk instance.
      logger.error('Clerk user lookup rejected', { status: res.status });
      throw new ServiceUnavailableError('Could not verify sign-in right now', 'CLERK_UNAVAILABLE');
    }

    const user = (await res.json()) as ClerkUser;
    if (user.banned || user.locked) {
      throw new UnauthorizedError('This account is not allowed to sign in', 'CLERK_USER_BLOCKED');
    }

    const primary = user.email_addresses?.find((e) => e.id === user.primary_email_address_id);
    if (!primary || primary.verification?.status !== 'verified') {
      throw new UnauthorizedError('Email address is not verified', 'EMAIL_NOT_VERIFIED');
    }

    const phone = user.phone_numbers?.find((p) => p.id === user.primary_phone_number_id)?.phone_number;
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();

    return {
      clerkUserId,
      email: primary.email_address.trim().toLowerCase(),
      name: name || undefined,
      phone: phone || undefined,
    };
  }
}
