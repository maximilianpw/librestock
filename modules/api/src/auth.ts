import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const host = process.env.PGHOST ?? 'localhost';
const isSocket = host.startsWith('/');

const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : new Pool({
      host,
      ...(isSocket ? {} : { port: Number.parseInt(process.env.PGPORT ?? '5432', 10) }),
      user: process.env.PGUSER ?? process.env.USER,
      password: process.env.PGPASSWORD ?? '',
      database: process.env.PGDATABASE ?? 'librestock_inventory',
    });

const trustedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
});
