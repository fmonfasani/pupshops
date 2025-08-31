import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts', // ajustá si tu ruta es otra
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true
});
