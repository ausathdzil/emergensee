import { POST } from '../ai/route';
import { unstable_noStore as noStore } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  noStore();

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Avoid executing cron work during build/local envs without secrets.
    return NextResponse.json({ ok: false, skipped: true }, { status: 200 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return POST();
}
