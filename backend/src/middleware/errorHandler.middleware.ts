import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors';
import { ApiResponse } from '../shared/responses/ApiResponse';
import { logger } from '../shared/utils/logger.util';

interface MongoDuplicateKeyError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const message = err.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    ApiResponse.error(res, 400, message || 'Validation failed', 'VALIDATION_ERROR');
    return;
  }

  if (err instanceof AppError) {
    ApiResponse.error(res, err.statusCode, err.message, err.code);
    return;
  }

  const errAny = err as any;

  if (errAny?.type === 'entity.too.large' || errAny?.status === 413) {
    ApiResponse.error(res, 413, 'Image payload too large. Please use smaller images.', 'PAYLOAD_TOO_LARGE');
    return;
  }

  if (errAny?.name === 'CastError') {
    ApiResponse.error(res, 400, `Invalid ID format for ${errAny.path || 'field'}`, 'INVALID_ID');
    return;
  }

  const maybeMongoError = err as MongoDuplicateKeyError;
  if (maybeMongoError?.code === 11000) {
    const field = Object.keys(maybeMongoError.keyValue ?? {})[0] ?? 'field';
    ApiResponse.error(res, 409, `Duplicate value for ${field}`, 'DUPLICATE_KEY');
    return;
  }

  logger.error('Unhandled error', err);
  const errMsg = err instanceof Error ? err.message : 'Internal server error';
  ApiResponse.error(res, 500, errMsg, 'INTERNAL_ERROR');
}
