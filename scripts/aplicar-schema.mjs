// Cria/atualiza as tabelas do site no banco do DATABASE_URL.
// Uso: node --env-file=.env.local scripts/aplicar-schema.mjs
import { readFileSync } from 'node:fs';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL (rode com --env-file=.env.local)');
  process.exit(1);
}

const sql = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');
const cliente = new pg.Client({ connectionString: url });
await cliente.connect();
try {
  await cliente.query(sql);
  const { rows } = await cliente.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1",
  );
  console.log('Tabelas:', rows.map((r) => r.table_name).join(', '));
} finally {
  await cliente.end();
}
