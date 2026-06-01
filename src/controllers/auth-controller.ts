import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/connection.ts';
import { users } from '../db/schema.ts';
import { generateToken } from '../utils/jwt.ts';
import { comparePassword, hashPassword } from '../utils/password.ts';
import type { NewUser } from '../db/schema.types.ts';
import { eq } from 'drizzle-orm';

import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginUser = z.infer<typeof loginUserSchema>;

export const register = async (
  req: Request<{}, {}, NewUser>,
  res: Response,
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    const hashedPassword = await hashPassword(password);

    // Create user
    const [createdUser] = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });

    // Generate JWT
    const token = await generateToken({
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: createdUser,
      token,
    });
  } catch (error) {
    console.error('❌ Register failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request<{}, {}, LoginUser>, res: Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('❌ Login failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
