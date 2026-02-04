import { registerAs } from '@nestjs/config';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getSSLConfig, getPoolMax, IDLE_TIMEOUT_MS } from './db-connection.utils';

const ssl = getSSLConfig();
const poolMax = getPoolMax();

export default registerAs('database', (): TypeOrmModuleOptions => {
  // If DATABASE_URL is set, use it (for production/CI)
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [`${__dirname  }/../**/*.entity{.ts,.js}`],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.NODE_ENV === 'development',
      ssl,
      extra: { max: poolMax, idleTimeoutMillis: IDLE_TIMEOUT_MS },
    };
  }

  // Otherwise use PG* env vars (devenv sets these)
  const host = process.env.PGHOST ?? 'localhost';
  const isSocket = host.startsWith('/');

  return {
    type: 'postgres',
    host,
    ...(isSocket ? {} : { port: Number.parseInt(process.env.PGPORT ?? '5432', 10) }),
    username: process.env.PGUSER ?? process.env.USER,
    password: process.env.PGPASSWORD ?? '',
    database: process.env.PGDATABASE ?? 'librestock_inventory',
    entities: [`${__dirname  }/../**/*.entity{.ts,.js}`],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV === 'development',
    ssl,
    extra: { max: poolMax, idleTimeoutMillis: IDLE_TIMEOUT_MS },
  };
});
