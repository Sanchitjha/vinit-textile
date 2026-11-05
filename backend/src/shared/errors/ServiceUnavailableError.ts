import { AppError } from './AppError';

export class ServiceUnavailableError extends AppError {
  readonly statusCode = 503;
  readonly code: string;

  constructor(message = 'Service unavailable', code = 'SERVICE_UNAVAILABLE') {
    super(message);
    this.code = code;
  }
}
