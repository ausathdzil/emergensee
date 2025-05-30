"use server";

import { db } from "@/db";
import { analysisLog, igdVisit, patient } from "@/db/schema";

import { revalidatePath } from "next/cache";
import { CreateIGDVisitSchema, CreatePatientSchema } from "../type-zod";
import { auth } from "../auth";
import { headers } from "next/headers";

type AIAnalysisResultType = {
  bpjsApprovalRate: number;
  bpjsIndicator: string;
  doctorStatus: string;
  aiSummary: string;
};

export async function createPatient(
  formData: FormData,
  aiOutputFromClient: AIAnalysisResultType
) {
  const rawFormData = Object.fromEntries(formData.entries());

  const patientDataForValidation = {
    name: rawFormData.name,
    birthDate: rawFormData.birthDate,
    gender: rawFormData.gender,
    phone: rawFormData.phone,
  };
  const validatedPatientData = CreatePatientSchema.safeParse(
    patientDataForValidation
  );

  if (!validatedPatientData.success) {
    console.error(
      "Invalid patient data:",
      validatedPatientData.error.flatten().fieldErrors
    );
    return {
      error: "Invalid patient data",
      details: validatedPatientData.error.flatten().fieldErrors,
    };
  }

  const dataPatient = {
    ...validatedPatientData.data,
  };

  const rawVisitData = {
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

  const validatedVisitData = CreateIGDVisitSchema.safeParse(rawVisitData);
  if (!validatedVisitData.success) {
    console.error(
      "Invalid visit data:",
      validatedVisitData.error.flatten().fieldErrors
    );
    return {
      error: "Invalid visit data",
      details: validatedVisitData.error.flatten().fieldErrors,
    };
  }

  const dataVisitBase = validatedVisitData.data;

  try {
    const newPatient = await db
      .insert(patient)
      .values(dataPatient)
      .returning({ id: patient.id });
    const patientId = newPatient[0].id;

    const staffSession = await auth.api.getSession({
      headers: await headers(),
    });

    const staffId = staffSession?.user?.id;
    if (!staffId) {
      console.error("Staff ID not found in session.");
      return { error: "Staff ID not found. User may not be authenticated." };
    }

    const visitTimestamp = new Date();

    const dataVisitComplete = {
      ...dataVisitBase,
      patientId: patientId,
      staffId: staffId,
      visitTimestamp: visitTimestamp,

      temperature: String(dataVisitBase.temperature),
    };

    const newIgdVisit = await db
      .insert(igdVisit)
      .values(dataVisitComplete)
      .returning({ id: igdVisit.id });
    const visitId = newIgdVisit[0].id;

    const dataAnalysisLog = {
      ...aiOutputFromClient,
      visitId: visitId,
      staffId: staffId,
      analysisTimestamp: new Date(),
      bpjsApprovalRate: String(aiOutputFromClient.bpjsApprovalRate),
    };

    await db.insert(analysisLog).values(dataAnalysisLog);
    revalidatePath("/dashboard");
    return { success: true, patientId, visitId };
  } catch (error) {
    console.error("Error during database insertion:", error);
    return {
      error: "Database insertion failed",
      details: (error as Error).message,
    };
  }
}
