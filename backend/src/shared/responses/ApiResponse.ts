import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, message: string, data: T | null = null, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number, message: string, code: string): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: { code },
    });
  }
}
