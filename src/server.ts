import express from 'express';
import type { Request, Response } from 'express';

// Create Express app
const app = express();

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
