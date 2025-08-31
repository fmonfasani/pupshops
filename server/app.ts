import express from 'express';
import cors from 'cors';
import type { Express } from 'express';
import { registerRoutes } from './routes';

export const app = express();

let wired = false;
export async function setupApp() {
  if (wired) return;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // health interno (duplicado por si se usa el app directo)
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  await registerRoutes(app as Express);

  wired = true;
}
