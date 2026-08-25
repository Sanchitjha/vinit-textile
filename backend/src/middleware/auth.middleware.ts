import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { UnauthorizedError } from '../shared/errors';
import { AccessTokenPayload } from '../shared/types/jwt-payload.type';
import { verifyJwt } from '../shared/utils/jwt.util';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authentication token missing'));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyJwt<AccessTokenPayload>(token, env.jwt.accessSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
