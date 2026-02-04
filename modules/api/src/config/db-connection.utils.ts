/**
 * Shared database connection utilities for TypeORM and Better Auth pg Pool.
 */

export function getSSLConfig(): { rejectUnauthorized: boolean } | false {
  const rejectUnauthorized =
    (process.env.DB_SSL_REJECT_UNAUTHORIZED ?? 'true').toLowerCase() === 'true';
  return process.env.DB_SSL === 'true'
    ? { rejectUnauthorized }
    : false;
}

export function getPoolMax(): number {
  const poolMax = Number.parseInt(process.env.DB_POOL_MAX ?? '20', 10);
  if (Number.isNaN(poolMax) || poolMax <= 0) {
    throw new Error('DB_POOL_MAX must be a positive integer');
  }
  return poolMax;
}

export const IDLE_TIMEOUT_MS = 30000;
