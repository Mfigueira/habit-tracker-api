import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users, habits, entries, tags, habitTags } from './schema.ts';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users, {
  email: z.email(),
  password: z.string().min(8),
  username: z.string().min(1).max(50),
});

export type Habit = InferSelectModel<typeof habits>;
export type NewHabit = InferInsertModel<typeof habits>;
export const selectHabitSchema = createSelectSchema(habits);
export const insertHabitSchema = createInsertSchema(habits);

export type Entry = InferSelectModel<typeof entries>;
export type NewEntry = InferInsertModel<typeof entries>;
export const selectEntrySchema = createSelectSchema(entries);
export const insertEntrySchema = createInsertSchema(entries);

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;
export const selectTagSchema = createSelectSchema(tags);
export const insertTagSchema = createInsertSchema(tags);

export type HabitTag = InferSelectModel<typeof habitTags>;
export type NewHabitTag = InferInsertModel<typeof habitTags>;
export const selectHabitTagSchema = createSelectSchema(habitTags);
export const insertHabitTagSchema = createInsertSchema(habitTags);
