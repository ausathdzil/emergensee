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
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${today} AND ${
        symptomReports.createdAt
      } < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      sevenDaysAgo: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${sevenDaysAgo} AND ${symptomReports.createdAt} < ${today}
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
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      today: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${
        symptomReports.createdAt
      } >= ${today} AND ${symptomReports.createdAt} < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      sevenDaysAgo: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${symptomReports.createdAt} >= ${sevenDaysAgo} AND ${symptomReports.createdAt} < ${today}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getDetectedAlerts() {
  cacheTag('detected-alerts');
  cacheLife('hours');

  const data = await db
    .select()
    .from(alerts)
    .where(eq(alerts.status, 'Terdeteksi'));

  return data;
}

export async function getReportsBySymptoms() {
  cacheTag('reports-by-symptoms');
  cacheLife('days');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      symptom: sql<string>`unnest(${symptomReports.symptoms})`,
      count: count(),
    })
    .from(symptomReports)
    .where(
      and(
        gte(symptomReports.createdAt, sevenDaysAgo),
        lt(symptomReports.createdAt, new Date())
      )
    )
    .groupBy(sql`unnest(${symptomReports.symptoms})`)
    .orderBy(desc(count()))
    .limit(7);

  return data;
}

export type SymptomWithLocations = {
  symptom: string;
  count: number;
  locations: { longitude: string; latitude: string }[];
};

export async function getSymptomsAndLocations(): Promise<
  SymptomWithLocations[]
> {
  cacheTag('symptoms-and-locations');
  cacheLife('days');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await db.execute(sql`
    SELECT
      symptom,
      COUNT(*) as count,
      ARRAY_AGG(ROW(longitude, latitude)::text) as locations
    FROM (
      SELECT
        UNNEST(symptoms) as symptom,
        longitude,
        latitude
      FROM symptom_reports
      WHERE created_at >= ${sevenDaysAgo} AND created_at < ${new Date()}
    ) as unnested
    GROUP BY symptom
    ORDER BY count DESC
    LIMIT 10;
  `);

  function parseLocationRow(rowStr: string) {
    const [longitude, latitude] = rowStr.replace(/[()]/g, '').split(',');
    return { longitude: Number(longitude), latitude: Number(latitude) };
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (data.rows as any[]).map((row) => ({
    symptom: row.symptom,
    count: Number(row.count),
    locations: Array.isArray(row.locations)
      ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        row.locations.map((loc: any) =>
          typeof loc === 'string' ? parseLocationRow(loc) : loc
        )
      : [],
  }));
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
