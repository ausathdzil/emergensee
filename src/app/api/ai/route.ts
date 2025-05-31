import { db } from '@/db';
import { getRecentSymptomReports } from '@/db/data';
import { alerts } from '@/db/schema';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST() {
  const reports = await getRecentSymptomReports();

  const prompt = `
      Analisis laporan gejala 24 jam terakhir berikut ini dan buat satu atau lebih rincian dalam Bahasa Indonesia untuk 
      peringatan (early warning) baru. Jika ada lebih dari satu pola/gejala/lokasi yang signifikan, buat beberapa objek peringatan.
      Keluarannya berupa ARRAY objek JSON dengan struktur sebagai berikut:
      [
        {
          "type": "string", // e.g., "Wabah", "Klaster"
          "province": "string",
          "city": "string",
          "district": "string",
          "relatedSymptoms": ["symptomName1", "symptomName2"], // Rangkum gejala-gejala umum yang terjadi
          "aiAnalysis": { // Berikan analisis singkat tentang temuan-temuan tersebut
            "risk": "string", // rendah, sedang, tinggi
            "confidence": "double", // 0-1
            "summary": "string", // ringkasan analisis
            "potentialCause": "string" // spekulasi berdasarkan data
          },
          "status": "string" // status awal = "Terdeteksi"
        }
      ]

      Berikut adalah laporan gejala:
      ${JSON.stringify(reports, null, 2)}
    `;

  const { object: alertsArray } = await generateObject({
    model: google('gemini-2.5-flash-preview-04-17'),
    output: 'array',
    schema: z.object({
      type: z.string(),
      province: z.string(),
      city: z.string(),
      district: z.string(),
      relatedSymptoms: z.array(z.string()),
      aiAnalysis: z.object({
        risk: z.string(),
        confidence: z.number(),
        summary: z.string(),
        potentialCause: z.string(),
      }),
      status: z.literal('Terdeteksi'),
    }),
    prompt,
  });

  for (const alert of alertsArray) {
    await db.insert(alerts).values({
      type: alert.type,
      province: alert.province,
      city: alert.city,
      district: alert.district,
      relatedSymptoms: alert.relatedSymptoms,
      aiAnalysis: alert.aiAnalysis,
      status: alert.status,
    });
  }

  return NextResponse.json(alertsArray);
}
