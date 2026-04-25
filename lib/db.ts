import { Pool, PoolClient } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

let _serverPool: Pool | undefined;

function getPool(): Pool {
  if (process.env.NODE_ENV === "development") {
    if (!global._pgPool) {
      global._pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        ssl: false,
      });
    }
    return global._pgPool;
  }
  if (!_serverPool) {
    _serverPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return _serverPool;
}

export async function query<T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function getClient(): Promise<PoolClient> {
  return getPool().connect();
}

export default { query, getClient };
