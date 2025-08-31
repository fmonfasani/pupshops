// api/index.ts

// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: any | null = null;

async function getApp() {
  if (cachedApp) return cachedApp;
  try {
    // intenta varias rutas de build comunes
    const mod =
      (await import('../server/index.js')) ||
      (await import('../server/app.js'));
    cachedApp = mod.default || mod.app || mod;
  } catch (e) {
    // fallback a handler mínimo
    cachedApp = null;
  }
  return cachedApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.url?.startsWith('/api/health')) {
    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  }

  const app = await getApp();

  if (!app) {
    // mini router de ejemplo
    if (req.method === 'GET' && req.url?.startsWith('/api')) {
      return res.status(200).json({ api: 'PupShops API', status: 'running' });
    }
    return res.status(404).json({ error: 'Not Found' });
  }

  // si es un Express (o similar) envuelve al vuelo
  if (typeof app === 'function' && app.handle) {
    const { default: serverlessHttp } = await import('serverless-http');
    const expressHandler = serverlessHttp(app);
    // @ts-ignore
    return expressHandler(req, res);
  }

  // si el build exporta un handler(req,res)
  if (typeof app === 'function') {
    // @ts-ignore
    return app(req, res);
  }

  return res.status(500).json({ error: 'Invalid server build export' });
}







