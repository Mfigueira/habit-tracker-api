import { z } from 'zod';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

const REQUEST_VALIDATION_MESSAGES: Partial<Record<keyof Request, string>> = {
  body: 'Invalid body schema',
  params: 'Invalid params schema',
  query: 'Invalid query schema',
};

const validateRequestKeySchema =
  <T extends keyof Request>(key: T) =>
  (schema: z.ZodType<any>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req[key]);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({
            message: REQUEST_VALIDATION_MESSAGES[key],
            ...z.treeifyError(error),
          });
          return;
        }
        next(error);
      }
    };
  };

export const validateBody = validateRequestKeySchema('body');
export const validateParams = validateRequestKeySchema('params');
export const validateQuery = validateRequestKeySchema('query');
