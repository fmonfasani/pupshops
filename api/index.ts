// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app, setupApp } from '../server/app';

// En Vercel no se hace app.listen; solo atendemos req/res.
// Express "app" ya es un request handler compatible.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await setupApp();        // registra rutas una sola vez (lazy init)
  return (app as any)(req, res);
}
