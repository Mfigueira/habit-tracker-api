import express from 'express';
import type { Request, Response } from 'express';
import v1Router from './routes/v1/index.ts';

const app = express();

app.use(express.json());

// Unversioned health check — useful for load balancers and uptime monitors
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1', v1Router);

export default app;
