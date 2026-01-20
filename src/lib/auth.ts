import { db } from '@/db';
import * as schema from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins/admin';

type Auth = ReturnType<typeof betterAuth>;

let _auth: Auth | null = null;

function createAuth(): Auth {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [admin(), nextCookies()],
  });
}

export function getAuth(): Auth {
  if (_auth) return _auth;
  _auth = createAuth();
  return _auth;
}

// Lazy proxy to avoid initializing auth (and DB) during build-time module evaluation.
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAuth() as unknown as Record<PropertyKey, unknown>)[prop];
  },
}) as Auth;
