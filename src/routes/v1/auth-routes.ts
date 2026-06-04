import { Router } from 'express';
import {
  login,
  loginUserSchema,
  register,
} from '../../controllers/auth-controller.ts';
import { validateBody } from '../../middleware/validation.ts';
import { insertUserSchema } from '../../db/schema.types.ts';

const authRouter = Router();

authRouter.post('/register', validateBody(insertUserSchema), register);

authRouter.post('/login', validateBody(loginUserSchema), login);

export { authRouter };
