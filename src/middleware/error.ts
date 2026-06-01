import type { NextFunction, Request, Response } from 'express';
import { isDevelopment } from '../../env.ts';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
  });
}

interface HttpError extends Error {
  status?: number;
  code?: number;
}

export function globalErrorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status ?? err.code ?? 500;

  // Always log; include stack only in development
  console.error(
    `[${status}] ${err.message}${isDevelopment ? `\n${err.stack}` : ''}`,
  );

  res.status(status).json({
    error: status < 500 ? err.message : 'Internal Server Error',
    ...(isDevelopment && status >= 500 && { details: err.stack }),
  });
}
