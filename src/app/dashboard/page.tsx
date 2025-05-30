import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from '@/db';
import { analysisLog } from '@/db/schema';

async function getAnalysisLogs() {
  const data = await db.select().from(analysisLog);

  return data;
}

export default async function Dashboard() {
  const analysisLogs = await getAnalysisLogs();

  return <pre>{JSON.stringify(analysisLogs, null, 2)}</pre>;
}
