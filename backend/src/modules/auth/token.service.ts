import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import { Role } from '../../shared/constants/roles.constant';
import { AccessTokenPayload, RefreshTokenPayload } from '../../shared/types/jwt-payload.type';
import { signJwt, verifyJwt } from '../../shared/utils/jwt.util';
import { TokenPair } from './auth.types';

const REFRESH_HASH_ROUNDS = 10;

export class TokenService {
  signAccessToken(userId: string, role: Role): string {
    const payload: AccessTokenPayload = { sub: userId, role };
    return signJwt(payload, env.jwt.accessSecret, env.jwt.accessExpiry);
  }

  signRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = { sub: userId };
    return signJwt(payload, env.jwt.refreshSecret, env.jwt.refreshExpiry);
  }

  issueTokenPair(userId: string, role: Role): TokenPair {
    return {
      accessToken: this.signAccessToken(userId, role),
      refreshToken: this.signRefreshToken(userId),
    };
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return verifyJwt<RefreshTokenPayload>(token, env.jwt.refreshSecret);
  }

  hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, REFRESH_HASH_ROUNDS);
  }

  compareRefreshToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}
