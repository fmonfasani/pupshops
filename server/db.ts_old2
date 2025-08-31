// server/db.ts
import 'dotenv/config';
import * as schema from '../shared/schema';

// Detectamos si corremos en Vercel (serverless)
const onVercel = !!process.env.VERCEL;

let db: any;

if (onVercel) {
  // --- Serverless (Vercel) con Neon HTTP ---
  // Requiere: npm i @neondatabase/serverless
  import { neon } from '@neondatabase/serverless';
  import { drizzle } from 'drizzle-orm/neon-http';
  import * as schema from '../shared/schema';

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set (serverless)');
  }

  const sql = neon(process.env.DATABASE_URL);
  // Nota: neon-http no usa Pool; el cliente es "sql"
  db = drizzle({ client: sql, schema });
} else {
  // --- Desarrollo local con pg (TCP) ---
  import { Pool } from 'pg';
  import { drizzle } from 'drizzle-orm/node-postgres';

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set (local)');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };
