import { z } from "zod";

const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir harus YYYY-MM-DD"),
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
  bloodPressure: z.coerce.number(),
  temperature: z.coerce.number(),
  respiratoryRate: z.coerce.number(),
  oxygenSaturation: z.coerce.number(),
  symptoms: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const AnalysisLogSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  staffId: z.string(),
  analysisTimestamp: z.date().default(() => new Date()),
  bpjsApprovalRate: z.number(),
  bpjsIndicator: z.string(),
  doctorStatus: z.string(),
  aiSummary: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreateAnalysisLogSchema = AnalysisLogSchema.pick({
  bpjsApprovalRate: true,
  bpjsIndicator: true,
  doctorStatus: true,
  aiSummary: true,
});

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePatientSchemaType = z.infer<typeof CreatePatientSchema>;

export const CreateIGDVisitSchema = IGDVisitSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  patientId: true,
  staffId: true,
});

export type CreateIGDVisitSchemaType = z.infer<typeof CreateIGDVisitSchema>;
