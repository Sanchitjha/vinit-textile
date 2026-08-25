import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly code: string;

  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message);
    this.code = code;
  }
}
