import { Router } from 'express';

const habitRouter = Router();

habitRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'All habits fetched successfully' });
});

habitRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Habit created successfully' });
});

habitRouter.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Habit fetched successfully' });
});

habitRouter.put('/:id', (req, res) => {
  res.status(200).json({ message: 'Habit updated successfully' });
});

habitRouter.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Habit deleted successfully' });
});

habitRouter.post('/:id/complete', (req, res) => {
  res.status(201).json({ message: 'Habit completed successfully' });
});

habitRouter.get('/:id/stats', (req, res) => {
  res.status(200).json({ message: 'Habit stats fetched successfully' });
});

export default habitRouter;
