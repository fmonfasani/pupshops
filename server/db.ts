// server/db.ts
import 'dotenv/config';
// 👇 IMPORTES ESTÁTICOS (Vercel compila a CJS; nada de import dentro de if)
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { Pool } from 'pg';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';

// ⚠️ Usa import relativo para schema (evita problemas de paths en Vercel)
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const onVercel = !!process.env.VERCEL;

let db:
  | ReturnType<typeof drizzleNeon>
  | ReturnType<typeof drizzlePg>;

if (onVercel) {
  // Serverless (Vercel) con Neon HTTP
  const sql = neon(process.env.DATABASE_URL);
  db = drizzleNeon({ client: sql, schema });
} else {
  // Desarrollo local con pg TCP
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

export { db };
