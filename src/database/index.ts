import { knex } from 'knex';
import path from 'path';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds')
  },
  useNullAsDefault: true,
});

export default db;