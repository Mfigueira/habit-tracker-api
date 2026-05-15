import { Router } from 'express';
import habitRouter from './habit-routes.ts';
import userRouter from './user-routes.ts';
import authRouter from './auth-routes.ts';

const v1Router = Router();

v1Router.use('/habits', habitRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/users', userRouter);

export default v1Router;
