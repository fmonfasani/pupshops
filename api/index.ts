// api/index.ts
export default async function handler(req: any, res: any) {
  if (req.url?.startsWith('/api/health')) {
    res.status(200).json({ ok: true, env: { vercel: !!process.env.VERCEL } });
    return;
  }
  const prod = !!process.env.VERCEL;
  try {
    const { app, setupApp } = prod
      ? require('../server-build/app.js')
      : require('../server/app');
    await setupApp();
    return (app as any)(req, res);
  } catch (e: any) {
    res.status(500).json({
      error: String(e?.message || e),
      where: 'api/index.ts -> require app',
      stack: (e?.stack || '').toString().split('\n').slice(0, 6),
      prod
    });
  }
}
