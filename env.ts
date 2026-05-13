import dotenv from 'dotenv';
import { z } from 'zod';

process.env.APP_STAGE = process.env.APP_STAGE || 'development';

export const isDevelopment = process.env.APP_STAGE === 'development';
export const isTesting = process.env.APP_STAGE === 'test';
export const isProduction = process.env.APP_STAGE === 'production';

if (isDevelopment) {
  dotenv.config({ path: ['.env.local', '.env'] });
} else if (isTesting) {
  dotenv.config({ path: '.env.test' });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  APP_STAGE: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid ENV variables:\n');
  console.error(JSON.stringify(z.treeifyError(parsedEnv.error), null, 2));
  process.exit(1);
}

env = parsedEnv.data;

export default env;
