import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { Pool } from 'pg';
import { getSSLConfig, getPoolMax, IDLE_TIMEOUT_MS } from './config/db-connection.utils';

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is required');
}

const databaseUrl = process.env.DATABASE_URL;
const host = process.env.PGHOST ?? 'localhost';
const isSocket = host.startsWith('/');
const ssl = getSSLConfig();
const poolMax = getPoolMax();

const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl, ssl, max: poolMax, idleTimeoutMillis: IDLE_TIMEOUT_MS })
  : new Pool({
      host,
      ...(isSocket ? {} : { port: Number.parseInt(process.env.PGPORT ?? '5432', 10) }),
      user: process.env.PGUSER ?? process.env.USER,
      password: process.env.PGPASSWORD ?? '',
      database: process.env.PGDATABASE ?? 'librestock_inventory',
      ssl,
      max: poolMax,
      idleTimeoutMillis: IDLE_TIMEOUT_MS,
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
  plugins: [admin()],
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
});
