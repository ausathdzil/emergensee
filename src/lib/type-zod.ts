import { z } from "zod";

const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthDate: z.date(),
  gender: z.string(),
  phone: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const IGDVisitSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  staffId: z.string(),
  visitTimestamp: z.date().default(() => new Date()),
  complaints: z.string(),
  bloodPressure: z.string(),
  temperature: z.number(),
  respiratoryRate: z.number(),
  oxygenSaturation: z.number(),
  symptoms: z.array(z.string()),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const AnalysisLogSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  staffId: z.string(),
  analysisTimestampe: z.date(),
  bpjsApprovalRate: z.number(),
  bpjsIndicator: z.string(),
  doctorStatus: z.string(),
  aiSummary: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateAnalysisLogSchema = AnalysisLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreatePatienSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateIGDVisitSchema = IGDVisitSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
