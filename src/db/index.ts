import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

type DrizzleDb = ReturnType<typeof drizzle>;

let _db: DrizzleDb | null = null;

export function getDb(): DrizzleDb {
  if (_db) return _db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is required to initialize the database connection.'
    );
  }

  const sql = neon(databaseUrl);
  _db = drizzle({ client: sql });
  return _db;
}

// Lazy proxy to avoid initializing DB during build-time module evaluation.
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    return (getDb() as unknown as Record<PropertyKey, unknown>)[prop];
  },
}) as DrizzleDb;
