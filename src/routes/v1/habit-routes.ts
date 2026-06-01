import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.ts';
import {
  createHabit,
  createHabitSchema,
  deleteHabitById,
  getHabitById,
  getUserHabits,
  updateHabitById,
  habitIdSchema,
  completeHabit,
  getHabitsByTag,
  tagIdSchema,
  addTagsToHabit,
  removeTagFromHabit,
} from '../../controllers/habit-controller.ts';
import { validateBody, validateParams } from '../../middleware/validation.ts';

const habitRouter = Router();

// Authenticate all habit routes
habitRouter.use(authenticateToken);

habitRouter.get('/', getUserHabits);

habitRouter.post('/', validateBody(createHabitSchema), createHabit);

habitRouter.get('/:id', validateBody(habitIdSchema), getHabitById);

habitRouter.put('/:id', validateParams(habitIdSchema), updateHabitById);

habitRouter.delete('/:id', validateParams(habitIdSchema), deleteHabitById);

habitRouter.post('/:id/complete', validateParams(habitIdSchema), completeHabit);

// Tag-related endpoints
habitRouter.get('/tag/:tagId', validateParams(tagIdSchema), getHabitsByTag);
habitRouter.post('/:id/tags', validateParams(habitIdSchema), addTagsToHabit);
habitRouter.delete('/:id/tags/:tagId', removeTagFromHabit);

export default habitRouter;
