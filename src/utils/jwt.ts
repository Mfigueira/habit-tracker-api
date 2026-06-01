import { SignJWT, jwtVerify } from 'jose';
import { createSecretKey } from 'crypto';
import env from '../../env.ts';

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
}

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8');

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
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8');
  const { payload } = await jwtVerify(token, secretKey);

  const verifiedPayload = {
    id: payload.id as string,
    email: payload.email as string,
    username: payload.username as string,
  };

  return verifiedPayload;
};
