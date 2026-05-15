import express from 'express';
import type { Request, Response } from 'express';
import v1Router from './routes/v1/index.ts';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { isDevelopment, isTesting } from '../env.ts';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(
  morgan(isDevelopment ? 'dev' : 'combined', {
    skip: isTesting,
  }),
);

// Unversioned health check — useful for load balancers and uptime monitors
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit Tracker API',
  });
});

app.use('/api/v1', v1Router);

export default app;
