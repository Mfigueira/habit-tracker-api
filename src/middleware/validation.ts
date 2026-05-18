import { z } from 'zod';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateBody = (schema: z.ZodType<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedBody = schema.parse(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: 'Invalid body schema', ...z.treeifyError(error) });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodType<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedParams = schema.parse(req.params);
      req.params = parsedParams;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({
            message: 'Invalid parameters schema',
            ...z.treeifyError(error),
          });
        return;
      }
      next(error);
    }
  };
};
