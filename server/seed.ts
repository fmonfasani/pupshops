import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { sql } from 'drizzle-orm';

async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  await db.execute(sql`
    insert into users (email, name, password_hash, role)
    values ('admin@local', 'Admin', ${hash}, 'admin')
    on conflict (email) do nothing
  `);
  console.log('admin listo');
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
