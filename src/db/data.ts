'use cache';

import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import { db } from '.';
import { alerts, symptomReports, user } from './schema';

export async function getTotalReports() {
  cacheTag('total-reports');
  cacheLife('hours');

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      lastSevenDays: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${sevenDaysAgo} AND ${
        symptomReports.createdAt
      } < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      previousSevenDays: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.createdAt} >= ${fourteenDaysAgo} AND ${symptomReports.createdAt} < ${sevenDaysAgo}
          THEN 1 ELSE 0 END
        ), 0)`,
    })
    .from(symptomReports);

  return data[0];
}

export async function getEmergencyReports() {
  cacheTag('emergency-reports');
  cacheLife('hours');

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      lastSevenDays: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${
        symptomReports.createdAt
      } >= ${sevenDaysAgo} AND ${symptomReports.createdAt} < ${new Date()}
          THEN 1 ELSE 0 END
        ), 0)`,
      previousSevenDays: sql<number>`
        COALESCE(SUM(CASE 
          WHEN ${symptomReports.isEmergency} = true AND ${symptomReports.createdAt} >= ${fourteenDaysAgo} AND ${symptomReports.createdAt} < ${sevenDaysAgo}
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
  cacheLife('hours');

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
  cacheLife('hours');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await db
    .select({
      symptom: sql<string>`UNNEST(${symptomReports.symptoms})`,
      count: sql<number>`COUNT(*)`,
      locations: sql<
        string[]
      >`ARRAY_AGG(ROW(${symptomReports.longitude}, ${symptomReports.latitude})::text)`,
    })
    .from(symptomReports)
    .where(
      and(
        gte(symptomReports.createdAt, sevenDaysAgo),
        lt(symptomReports.createdAt, new Date())
      )
    )
    .groupBy(sql`UNNEST(${symptomReports.symptoms})`)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(10);

  function parseLocationRow(rowStr: string) {
    const [longitude, latitude] = rowStr.replace(/[()]/g, '').split(',');
    return { longitude: Number(longitude), latitude: Number(latitude) };
  }

  return data.map((row) => ({
    symptom: row.symptom,
    count: Number(row.count),
    locations: Array.isArray(row.locations)
      ? row.locations.map((loc: string) => ({
          longitude: parseLocationRow(loc).longitude.toString(),
          latitude: parseLocationRow(loc).latitude.toString(),
        }))
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
  cacheLife('hours');

  const data = await db
    .select()
    .from(symptomReports)
    .orderBy(desc(symptomReports.createdAt))
    .limit(5);

  return data;
}

export async function getEmergencyAndNonEmergencyReports() {
  cacheTag('emergency-and-non-emergency-reports');
  cacheLife('hours');

  const data = await db
    .select({
      date: sql<string>`to_char(${symptomReports.createdAt}, 'YYYY-MM-DD')`,
      emergency: sql<number>`COUNT(*) FILTER (WHERE ${symptomReports.isEmergency} = true)`,
      nonEmergency: sql<number>`COUNT(*) FILTER (WHERE ${symptomReports.isEmergency} = false OR ${symptomReports.isEmergency} IS NULL)`,
    })
    .from(symptomReports)
    .groupBy(sql`to_char(${symptomReports.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(desc(sql`to_char(${symptomReports.createdAt}, 'YYYY-MM-DD')`))
    .limit(30);

  return data
    .map((row) => ({
      date: row.date,
      emergency: Number(row.emergency),
      nonEmergency: Number(row.nonEmergency),
    }))
    .reverse();
}

export async function getRecentSymptomReports() {
  cacheTag('recent-symptom-reports');
  cacheLife('hours');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const data = await db
    .select()
    .from(symptomReports)
    .where(
      and(
        gte(symptomReports.createdAt, twentyFourHoursAgo),
        lt(symptomReports.createdAt, new Date())
      )
    )
    .orderBy(desc(symptomReports.createdAt))
    .limit(10);

  return data;
}

export async function getAlertById(id: string) {
  cacheTag('alert-by-id');
  cacheLife('hours');

  const data = await db.select().from(alerts).where(eq(alerts.id, id));
  return data[0];
}

export async function getUserById(id: string) {
  cacheTag('user-by-id');
  cacheLife('hours');

  const data = await db.select().from(user).where(eq(user.id, id));
  return data[0];
}
