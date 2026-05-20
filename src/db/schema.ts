import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// **********************************
// ************ TYPES ***************
// **********************************

export const frequencyEnum = pgEnum('frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

// **********************************
// ************ TABLES **************
// **********************************

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  frequency: frequencyEnum('frequency').notNull().default('daily'),
  targetCount: integer('target_count').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  completionDate: timestamp('completion_date').notNull().defaultNow(),
  note: text('note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  hexColor: varchar('hex_color', { length: 7 }).default('#6B7280'), // hex color
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Many-to-many relationship between habits and tags
export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// **********************************
// ********** RELATIONS *************
// **********************************

export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}));

export const habitRelations = relations(habits, ({ many, one }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  entries: many(entries),
  habitTags: many(habitTags),
}));

export const entryRelations = relations(entries, ({ one }) => ({
  habit: one(habits, { fields: [entries.habitId], references: [habits.id] }),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}));

export const habitTagRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, { fields: [habitTags.habitId], references: [habits.id] }),
  tag: one(tags, { fields: [habitTags.tagId], references: [tags.id] }),
}));
