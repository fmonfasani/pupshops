// api/index.ts
import { app, setupApp } from '../server/app';

export default async function handler(req: any, res: any) {
  await setupApp();      // registra rutas 1 sola vez
  return (app as any)(req, res);
}
