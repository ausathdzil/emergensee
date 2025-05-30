"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import {
  CreateAnalysisLogSchema,
  CreateIGDVisitSchema,
  CreateIGDVisitSchemaType,
  CreatePatientSchema,
  CreatePatientSchemaType,
} from "../type-zod";
import { promises as fs } from "fs";
import path from "path";

async function getAiResponse(
  patientData: CreatePatientSchemaType,
  visitData: CreateIGDVisitSchemaType,
  metricsContent: string,
  policyContent: string
) {
  try {
    const { object: aiOutputObject } = await generateObject({
      model: google("gemini-2.5-flash-preview-04-17", {
        structuredOutputs: true,
      }),
      schema: CreateAnalysisLogSchema,
      prompt: `
          Anda adalah seorang asisten medis AI yang bertugas untuk mengevaluasi kelayakan seorang pasien untuk mendapatkan layanan BPJS berdasarkan data yang diberikan dan kebijakan serta metrik kegawatdaruratan.
          Output HARUS berupa objek JSON yang valid sesuai dengan skema yang disediakan dan HANYA berisi field berikut: "bpjsApprovalRate", "bpjsIndicator", "aiSummary", "doctorStatus".
          JANGAN menyertakan field "staffId", "visitId", atau "analysisTimestamp" dalam output Anda.

          Berikut adalah data pasien:
          Nama: ${patientData.name}
          Tanggal Lahir: ${patientData.birthDate}
          Jenis Kelamin: ${patientData.gender}
          Nomor Telepon: ${patientData.phone}
          Keluhan Utama: ${visitData.complaints}
          Tekanan Darah: ${visitData.bloodPressure}
          Laju Pernapasan: ${visitData.respiratoryRate}
          Suhu Tubuh: ${visitData.temperature}
          Saturasi Oksigen: ${visitData.oxygenSaturation}
          Gejala Saat Ini: ${visitData.symptoms.join(", ")}

          Berikut adalah METRIK KEGAWATDARURATAN yang harus Anda pertimbangkan:
          ${metricsContent}

          Berikut adalah KEBIJAKAN BPJS yang relevan:
          ${policyContent}

          Tugas Anda adalah memberikan output dalam format JSON dengan struktur HANYA field berikut:
          {
            "bpjsApprovalRate": <angka 1-100>,
            "bpjsIndicator": "<string, salah satu dari: 'Sangat Tinggi', 'Tinggi', 'Sedang', 'Rendah', 'Sangat Rendah', 'N/A'>",
            "aiSummary": "<string, penjelasan rinci mengapa skor tersebut diberikan, hubungkan dengan metrik dan kebijakan, rekomendasi tindakan medis yang paling sesuai, misal: 'Segera ke IGD', 'Konsultasi dokter umum dalam 24 jam', 'Perawatan mandiri di rumah dengan observasi', identifikasi gejala tambahan yang mungkin relevan berdasarkan deskripsi pasien atau tidak disebutkan secara eksplisit namun sering terkait>",
            "doctorStatus": "<string, status dokter yang paling sesuai berdasarkan analisis AI, misal: 'IGD', 'Konsultasi', 'Perawatan Mandiri'>"
          }

          Analisis data pasien dengan seksama, bandingkan dengan metrik dan kebijakan. Berikan skor kelayakan BPJS dari 1 hingga 100, di mana 100 berarti sangat layak/sangat gawat darurat. Sertakan alasan yang jelas, tingkat keyakinan Anda (Sangat Tinggi, Tinggi, Sedang, Rendah, Sangat Rendah, atau N/A jika tidak bisa menentukan), rekomendasi tindakan, serta identifikasi gejala dan komorbid tambahan jika ada.
          Pastikan output HANYA berupa JSON yang valid dan HANYA berisi field yang telah ditentukan.
        `,
    });
    return aiOutputObject;
  } catch (error) {
    console.error("Error in getAiResponse:", error);
    if (
      error instanceof Error &&
      error.message.includes("AI_NoObjectGeneratedError")
    ) {
      return {
        error: "AI tidak menghasilkan output yang sesuai skema. Coba lagi.",
      };
    } else if (
      error instanceof Error &&
      error.message.includes("AI_TypeValidationError")
    ) {
      return {
        error: "Output AI tidak lolos validasi tipe. Ada kesalahan format.",
      };
    }
    return { error: "Gagal mendapatkan respons AI." };
  }
}

export async function analyzePatient(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const patientDataForValidation = {
    name: rawFormData.name,
    birthDate: rawFormData.birthDate,
    gender: rawFormData.gender,
    phone: rawFormData.phone,
  };
  const validatedFieldsPatient = CreatePatientSchema.safeParse(
    patientDataForValidation
  );

  const visitDataForValidation = {
    complaints: rawFormData.complaints,
    bloodPressure: rawFormData.bloodPressure,
    respiratoryRate: rawFormData.respiratoryRate,
    temperature: rawFormData.temperature,
    oxygenSaturation: rawFormData.oxygenSaturation,
    symptoms:
      rawFormData.symptomps && typeof rawFormData.symptomps === "string"
        ? (rawFormData.symptomps as string)
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        : [],
  };
  const validatedFieldsVisit = CreateIGDVisitSchema.safeParse(
    visitDataForValidation
  );

  try {
    const metricsPath = path.join(
      process.cwd(),
      "public",
      "urgent-metrics.txt"
    );
    const policyPath = path.join(process.cwd(), "public", "urgent-policy.txt");
    const metricsContent = await fs.readFile(metricsPath, "utf-8");
    const policyContent = await fs.readFile(policyPath, "utf-8");

    if (!validatedFieldsPatient.success || !validatedFieldsVisit.success) {
      console.log(
        "Patient validation errors:",
        validatedFieldsPatient.error?.flatten().fieldErrors
      );
      console.log(
        "Visit validation errors:",
        validatedFieldsVisit.error?.flatten().fieldErrors
      );
      const patientErrors = validatedFieldsPatient.error?.flatten().fieldErrors;
      const visitErrors = validatedFieldsVisit.error?.flatten().fieldErrors;
      return {
        error: "Invalid fields",
        details: {
          patient: patientErrors,
          visit: visitErrors,
        },
      };
    }

    const aiOutput = await getAiResponse(
      validatedFieldsPatient.data,
      validatedFieldsVisit.data,
      metricsContent,
      policyContent
    );

    if (
      aiOutput &&
      typeof aiOutput === "object" &&
      "error" in aiOutput &&
      aiOutput.error
    ) {
      return aiOutput;
    }

    return aiOutput;
  } catch (error) {
    console.error("Error in analyzePatient:", error);
    return { error: "Terjadi kesalahan sistem saat menganalisis data." };
  }
}
