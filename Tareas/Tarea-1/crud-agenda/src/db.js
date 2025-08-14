import pg from 'pg';

const config = {
  host: 'localhost',
  port: 5433,
  database: 'agenda_db',
  user: 'postgres',
  password: 'postgres',
};

export const pool = new pg.Pool(config);

pool.query('SELECT 1').then(() => {
  console.log(`[DB] Connected as ${config.user}@${config.host}:${config.port}/${config.database}`);
}).catch((e) => {
  console.error('[DB] Connection error:', e.message);
});
