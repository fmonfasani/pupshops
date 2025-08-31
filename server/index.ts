
import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger simple para /api
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  // @ts-expect-error: mantener firma flexible
  res.json = function (body: any, ...args: any[]) {
    capturedJsonResponse = body;
    return originalResJson(body, ...args);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch { /* ignore */ }
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + '…';
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Registra rutas (puede devolver un http.Server)
  const server = await registerRoutes(app);

  // Manejo de errores global
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || 'Internal Server Error';
    res.status(status).json({ message });
    if (process.env.NODE_ENV !== 'test') {
      console.error(err);
    }
  });

  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';
  console.log('[BOOT]', { NODE_ENV: process.env.NODE_ENV, isDev });

  if (isDev) {
    await setupVite(app, server);
  } else {
    try {
      serveStatic(app);
    } catch (e) {
      console.warn('No build found, fallback to Vite dev:', (e as Error).message);
      await setupVite(app, server);
    }
  }


  // Puerto/host locales (sin Replit)
  const port = Number.parseInt(process.env.PORT || '3001', 10);
  const host = process.env.HOST || '0.0.0.0';

  // Mantengo la firma con objeto (y reusePort) si tu server la soporta
  //server.listen(
  //  { port, host, reusePort: true } as any,
  //  () => log(`Server listening on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
  //);

  server.listen(port, () => log(`Server listening on http://localhost:${port}`));


})();
