import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully' });
});

authRouter.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

export default authRouter;
