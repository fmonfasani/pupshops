// api/index.ts
export default async function handler(req: any, res: any) {
  // health sin depender de nada
  if (req.url?.startsWith('/api/health')) {
    res.status(200).json({ ok: true, env: { vercel: !!process.env.VERCEL } });
    return;
  }

  const prod = !!process.env.VERCEL;
  try {
    // En prod cargamos el build JS (server-build). En local, el TS.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { app, setupApp } = prod
      ? require('../server-build/app.js')
      : require('../server/app');

    await setupApp();
    return (app as any)(req, res);
  } catch (e: any) {
    // Si algo falla, devolvemos el error para diagnosticar
    res.status(500).json({
      error: String(e?.message || e),
      where: 'api/index.ts -> require app',
      stack: (e?.stack || '').toString().split('\n').slice(0, 6),
      prod,
    });
  }
}
