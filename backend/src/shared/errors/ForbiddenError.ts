import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly code: string;

  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message);
    this.code = code;
  }
}
