import { AppError } from './AppError';

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly code: string;

  constructor(message = 'Conflict', code = 'CONFLICT') {
    super(message);
    this.code = code;
  }
}
