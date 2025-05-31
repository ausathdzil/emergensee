'use cache';

import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import { db } from '.';
import { alerts, symptomReports } from './schema';

export async function getTotalReports() {
  cacheTag('total-reports');
  cacheLife('days');

  const now = Date.now();
  const today = new Date(now - 24 * 60 * 60 * 1000);
  const yesterday = new Date(now - 48 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${today} AND ${
        symptomReports.createdAt
      } < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      yesterday: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${yesterday} AND ${symptomReports.createdAt} < ${today}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getEmergencyReports() {
  cacheTag('emergency-reports');
  cacheLife('days');

  const now = Date.now();
  const today = new Date(now - 24 * 60 * 60 * 1000);
  const yesterday = new Date(now - 48 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${
        symptomReports.createdAt
      } >= ${today} AND ${symptomReports.createdAt} < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      yesterday: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${symptomReports.createdAt} >= ${yesterday} AND ${symptomReports.createdAt} < ${today}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getActiveAlerts() {
  cacheTag('active-alerts');
  cacheLife('hours');

  const data = await db
    .select()
    .from(alerts)
    .where(eq(alerts.status, 'active'));

  return data;
}

export async function getReportsBySymptoms() {
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
    .orderBy(desc(count()))
    .limit(7);

  return data;
}

export async function getSymptomsAndLocations() {
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
  cacheTag('all-alerts');
  cacheLife('hours');

  const data = await db.select().from(alerts).orderBy(desc(alerts.createdAt));

  return data;
}

export async function getRecentReports() {
  cacheTag('recent-reports');
  cacheLife('days');

  const data = await db
    .select()
    .from(symptomReports)
    .orderBy(desc(symptomReports.createdAt))
    .limit(5);

  return data;
}
