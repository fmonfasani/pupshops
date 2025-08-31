import type { Express } from 'express';
import { register, login, authRequired } from './auth';

export async function registerRoutes(app: Express) {
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);

  app.get('/api/me', authRequired, (req: any, res) => {
    res.json({ userId: req.user?.id ?? null });
  });
}
