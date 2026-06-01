import { SignJWT, jwtVerify } from 'jose';
import { createSecretKey } from 'crypto';
import { z } from 'zod';
import env from '../../env.ts';

const jwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
});

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

const generateSecretKey = () => {
  return createSecretKey(env.JWT_SECRET, 'utf-8');
};

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  const secretKey = generateSecretKey();

  const token = await new SignJWT({
    id: payload.id,
    email: payload.email,
    username: payload.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const secretKey = generateSecretKey();

  const { payload } = await jwtVerify(token, secretKey);

  return jwtPayloadSchema.parse(payload);
};
