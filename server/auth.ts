import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { db } from './db';

import { sql } from 'drizzle-orm';

type JwtPayload = { uid: string };const JWT_SECRET = process.env.JWT_SECRET ?? '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set');
}
const TOKEN_TTL = (process.env.TOKEN_TTL as jwt.SignOptions['expiresIn']) ?? '7d';

function signToken(uid: string) {
  return jwt.sign({ uid } as JwtPayload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // @ts-ignore
    req.user = { id: payload.uid };
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });

  const { rows: existing } = await db.execute(
    sql`select id from users where email = ${email} limit 1`
  );
  if (existing.length) return res.status(409).json({ error: 'email already in use' });

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await db.execute(sql`
    insert into users (email, name, password_hash)
    values (${email}, ${name ?? null}, ${passwordHash})
    returning id, email
  `);

  const user = rows[0];
  const token = signToken(String(user.id));
  res.json({ token, user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });

  const { rows } = await db.execute(
    sql`select id, email, password_hash from users where email = ${email} limit 1`
  );
  const user = rows[0];
  if (!user?.password_hash) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = signToken(String(user.id));
  res.json({ token, user: { id: user.id, email: user.email } });
}
