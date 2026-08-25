import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export function signJwt<T extends object>(payload: T, secret: Secret, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyJwt<T>(token: string, secret: Secret): T {
  return jwt.verify(token, secret) as T;
}
