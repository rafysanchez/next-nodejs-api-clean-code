import express, { Express, Request, Response, NextFunction } from 'express';
import { userRoutes } from './routes/userRoutes.ts';

export function createExpressApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', (req: Request, _res: Response, next: NextFunction) => {
    console.log(`[API ${req.method}] ${req.originalUrl}`);
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/users', userRoutes);

  return app;
}
