import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import { db } from '.';
import { alerts, symptomReports } from './schema';

export async function getTotalReports() {
  'use cache';

  cacheTag('total-reports');
  cacheLife('days');

  const now = Date.now();
  const todayStart = new Date(now - 24 * 60 * 60 * 1000);
  const yesterdayStart = new Date(now - 48 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${todayStart} AND ${
        symptomReports.createdAt
      } < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      yesterday: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${yesterdayStart} AND ${symptomReports.createdAt} < ${todayStart}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getEmergencyReports() {
  'use cache';

  cacheTag('emergency-reports');
  cacheLife('days');

  const now = Date.now();
  const todayStart = new Date(now - 24 * 60 * 60 * 1000);
  const yesterdayStart = new Date(now - 48 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${
        symptomReports.createdAt
      } >= ${todayStart} AND ${symptomReports.createdAt} < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      yesterday: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${symptomReports.createdAt} >= ${yesterdayStart} AND ${symptomReports.createdAt} < ${todayStart}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getActiveAlerts() {
  'use cache';

  cacheTag('active-alerts');
  cacheLife('hours');

  const data = await db
    .select({
      count: count(),
    })
    .from(alerts)
    .where(eq(alerts.status, 'active'));

  return data[0];
}

export async function getReportsBySymptoms() {
  'use cache';

  cacheTag('reports-by-symptoms');
  cacheLife('days');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      symptom: sql<string>`unnest(${symptomReports.symptoms})`,
      count: count(),
    })
    .from(symptomReports)
    .where(gte(symptomReports.createdAt, thirtyDaysAgo))
    .groupBy(sql`unnest(${symptomReports.symptoms})`)
    .orderBy(desc(count()));

  return data;
}

export async function getSymptomsAndLocations() {
  'use cache';

  cacheTag('symptoms-and-locations');
  cacheLife('days');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      symptom: sql<string>`unnest(${symptomReports.symptoms})`,
      longitude: symptomReports.longitude,
      latitude: symptomReports.latitude,
    })
    .from(symptomReports)
    .where(
      and(
        gte(symptomReports.createdAt, sevenDaysAgo),
        lt(symptomReports.createdAt, new Date())
      )
    )
    .groupBy(
      symptomReports.symptoms,
      symptomReports.longitude,
      symptomReports.latitude
    );

  return data;
}

export async function getAllAlerts() {
  'use cache';

  cacheTag('all-alerts');
  cacheLife('hours');

  const data = await db.select().from(alerts);

  return data;
}

export async function getAllReportsIn7Days() {
  'use cache';

  cacheTag('all-reports-in-7-days');
  cacheLife('days');

  const data = await db
    .select()
    .from(symptomReports)
    .where(
      and(
        gte(
          symptomReports.createdAt,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ),
        lt(symptomReports.createdAt, new Date())
      )
    );

  return data;
}
