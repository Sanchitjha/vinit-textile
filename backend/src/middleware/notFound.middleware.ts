import { Request, Response } from 'express';
import { ApiResponse } from '../shared/responses/ApiResponse';

export function notFoundHandler(req: Request, res: Response): void {
  ApiResponse.error(res, 404, `Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND');
}
