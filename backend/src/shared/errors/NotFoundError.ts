import { AppError } from './AppError';

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code: string;

  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message);
    this.code = code;
  }
}
