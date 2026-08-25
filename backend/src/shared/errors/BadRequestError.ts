import { AppError } from './AppError';

export class BadRequestError extends AppError {
  readonly statusCode = 400;
  readonly code: string;

  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(message);
    this.code = code;
  }
}
