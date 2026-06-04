import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.ts';

const userRouter = Router();

// Authenticate all user routes
userRouter.use(authenticateToken);

userRouter.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile fetched successfully' });
});

userRouter.put('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile updated successfully' });
});

userRouter.put('/password', (req, res) => {
  res.status(200).json({ message: 'User password updated successfully' });
});

export { userRouter };
