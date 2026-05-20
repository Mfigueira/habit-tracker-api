import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import env, { isProduction } from '../../env.ts';
import { remember } from '@epic-web/remember';
import * as schema from './schema.ts';

const createPool = () =>
  new Pool({
    connectionString: env.DATABASE_URL,
  });

const client = isProduction
  ? createPool()
  : remember('db-pool', () => createPool());

export const db = drizzle({ client, schema });
