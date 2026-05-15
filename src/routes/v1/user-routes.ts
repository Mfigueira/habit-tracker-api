import { Router } from 'express';

const userRouter = Router();

userRouter.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile fetched successfully' });
});

userRouter.put('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile updated successfully' });
});

userRouter.put('/password', (req, res) => {
  res.status(200).json({ message: 'User password updated successfully' });
});

export default userRouter;
