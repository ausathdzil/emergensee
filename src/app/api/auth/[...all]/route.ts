import { getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { unstable_noStore as noStore } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  const { GET } = toNextJsHandler(getAuth());
  return GET(request);
}

export async function POST(request: NextRequest) {
  noStore();
  const { POST } = toNextJsHandler(getAuth());
  return POST(request);
}
