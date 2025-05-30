<<<<<<< HEAD
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getActiveAlerts,
  getAllAlerts,
  getEmergencyReports,
  getReportsBySymptoms,
  getTotalReports,
} from '@/db/data';
import { Alert } from '@/db/schema';
import {
  Loader,
  MoreVerticalIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Suspense } from 'react';
import { columns } from './alert-table-columns';
import { DataTable } from './data-table';
import { SymptomsTrendChart } from './symptoms-trend-chart';

const totalReportsDummy = {
  today: 24,
  yesterday: 20,
};

const emergencyReportsDummy = {
  today: 10,
  yesterday: 12,
};

const activeAlertsDummy = {
  count: 5,
};

const alertsDummy: Alert[] = [
  {
    id: '1',
    type: 'Lonjakan Kasus IGD',
    district: 'Jakarta',
    status: 'Aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalysis: {},
    province: 'Jakarta',
    city: 'Jakarta',
    relatedSymptoms: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
  },
  {
    id: '2',
    type: 'Lonjakan Kasus IGD',
    district: 'Jakarta',
    status: 'Aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalysis: {},
    province: 'Jakarta',
    city: 'Jakarta',
    relatedSymptoms: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
  },
  {
    id: '3',
    type: 'Lonjakan Kasus IGD',
    district: 'Jakarta',
    status: 'Aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalysis: {},
    province: 'Jakarta',
    city: 'Jakarta',
    relatedSymptoms: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
  },
  {
    id: '4',
    type: 'Lonjakan Kasus IGD',
    district: 'Jakarta',
    status: 'Aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalysis: {},
    province: 'Jakarta',
    city: 'Jakarta',
    relatedSymptoms: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
  },
  {
    id: '5',
    type: 'Lonjakan Kasus IGD',
    district: 'Jakarta',
    status: 'Aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalysis: {},
    province: 'Jakarta',
    city: 'Jakarta',
    relatedSymptoms: [],
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
  },
];

export default async function Dashboard() {
  const [totalReports, igdReports, activeAlerts, allAlerts, symptomsTrend] =
    await Promise.all([
      getTotalReports(),
      getEmergencyReports(),
      getActiveAlerts(),
      getAllAlerts(),
      getReportsBySymptoms(),
    ]);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Dashboard</h1>
      </header>
      <main className="@container/main flex-1 flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<Loader className="animate-spin" />}>
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @2xl/main:grid-cols-3">
              <TotalReports totalReports={totalReportsDummy} />
              <EmergencyReports emergencyReports={emergencyReportsDummy} />
              <ActiveAlerts activeAlerts={activeAlertsDummy} />
            </div>
            <SymptomsTrendChart symptomsTrend={symptomsTrend} />
            <DataTable columns={columns} data={alertsDummy} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function TotalReports({
  totalReports,
}: {
  totalReports: Awaited<ReturnType<typeof getTotalReports>>;
}) {
  const today = Number(totalReports.today) || 0;
  const yesterday = Number(totalReports.yesterday) || 0;
  const diff = today - yesterday;

  let percent: number;

  if (yesterday === 0 && today === 0) {
    percent = 0;
  } else if (yesterday === 0) {
    percent = 100;
  } else {
    percent = (diff / yesterday) * 100;
  }

  const isDown = percent < 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Laporan Harian</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {totalReports.today}
        </CardTitle>
        {percent !== 0 && (
          <CardAction>
            <Badge variant="outline">
              {isDown ? (
                <TrendingDown className="text-primary" />
              ) : (
                <TrendingUp className="text-destructive" />
              )}
              {Math.abs(Math.round(percent))}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Laporan harian dalam 24 jam terakhir
        </div>
      </CardFooter>
    </Card>
  );
}

function EmergencyReports({
  emergencyReports,
}: {
  emergencyReports: Awaited<ReturnType<typeof getEmergencyReports>>;
}) {
  const today = Number(emergencyReports.today) || 0;
  const yesterday = Number(emergencyReports.yesterday) || 0;
  const diff = today - yesterday;

  let percent: number;

  if (yesterday === 0 && today === 0) {
    percent = 0;
  } else if (yesterday === 0) {
    percent = 100;
  } else {
    percent = (diff / yesterday) * 100;
  }

  const isDown = percent < 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Indikasi IGD</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {emergencyReports.today}
        </CardTitle>
        {percent !== 0 && (
          <CardAction>
            <Badge variant="outline">
              {isDown ? (
                <TrendingDown className="text-primary" />
              ) : (
                <TrendingUp className="text-destructive" />
              )}
              {Math.abs(Math.round(percent))}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Kasus dengan indikasi IGD untuk 24 jam terakhir
        </div>
      </CardFooter>
    </Card>
  );
}

function ActiveAlerts({
  activeAlerts,
}: {
  activeAlerts: Awaited<ReturnType<typeof getActiveAlerts>>;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Peringatan Aktif</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {activeAlerts.count}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          Peringatan yang perlu tinjauan segera
        </div>
      </CardFooter>
    </Card>
  );
}

function AlertTable({
  alerts,
}: {
  alerts: Awaited<ReturnType<typeof getAllAlerts>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Peringatan</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.id}</TableCell>
                <TableCell>{alert.type}</TableCell>
                <TableCell>{alert.district}</TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{alert.createdAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
=======
"use client";

import { useEffect, useState, useTransition } from "react";
import { analyzePatient } from "@/lib/actions/analyze-patient";
import { createPatient } from "@/lib/actions/create-patient";

type AIAnalysisResultType = {
  bpjsApprovalRate: number;
  bpjsIndicator: string;
  doctorStatus: string;
  aiSummary: string;
  error?: string;
};

type SaveResultType = {
  success?: boolean;
  patientId?: string;
  visitId?: string;
  error?: string;
  details?: any;
};

export default function DashboardPage() {
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const initialFormData = {
    name: "",
    birthDate: "",
    gender: "",
    phone: "",
    complaints: "",
    bloodPressure: "",
    respiratoryRate: "",
    temperature: "",
    oxygenSaturation: "",
    symptomps: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [aiResult, setAiResult] = useState<AIAnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAnalysis = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setAiResult(null);
    setSaveSuccessMessage(null);

    startAnalyzing(async () => {
      const currentFormData = new FormData();
      for (const key in formData) {
        currentFormData.append(key, formData[key as keyof typeof formData]);
      }
      const result: AIAnalysisResultType | { error: string } | undefined =
        await analyzePatient(currentFormData);

      if (result && "error" in result && result.error) {
        setError(result.error);
        setAiResult(null);
      } else if (result && !("error" in result)) {
        setAiResult(result as AIAnalysisResultType);
        setError(null);
      } else {
        setError(
          "Analisis AI gagal atau mengembalikan hasil yang tidak terduga."
        );
        setAiResult(null);
      }
    });
  };

  const handleSaveData = async () => {
    if (!aiResult || (aiResult && "error" in aiResult && aiResult.error)) {
      setError(
        "Tidak ada hasil analisis AI yang valid untuk disimpan atau analisis masih mengandung error."
      );
      return;
    }
    setError(null);
    setSaveSuccessMessage(null);

    startSaving(async () => {
      const currentFormData = new FormData();
      for (const key in formData) {
        currentFormData.append(key, formData[key as keyof typeof formData]);
      }

      const validAiResult = aiResult as Omit<AIAnalysisResultType, "error">;

      const saveResult: SaveResultType | undefined = await createPatient(
        currentFormData,
        validAiResult
      );

      if (saveResult && saveResult.error) {
        setError(
          saveResult.details
            ? `${saveResult.error}: ${JSON.stringify(saveResult.details)}`
            : saveResult.error
        );
        setSaveSuccessMessage(null);
      } else if (saveResult && saveResult.success) {
        setSaveSuccessMessage(
          `Data pasien berhasil disimpan! Pasien ID: ${saveResult.patientId}, Kunjungan ID: ${saveResult.visitId}`
        );
        setAiResult(null);
        setFormData(initialFormData);
      } else {
        setError("Gagal menyimpan data atau hasil penyimpanan tidak terduga.");
        setSaveSuccessMessage(null);
      }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Input Data Pasien & Analisis IGD
      </h1>

      <form
        onSubmit={handleSubmitAnalysis}
        className="space-y-6 mb-8 p-6 bg-white shadow-xl rounded-lg"
      >
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">
            Data Pasien
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Pasien
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="birthDate"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Jenis Kelamin
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2 pt-4">
            Data Kunjungan IGD
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="complaints"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Keluhan Utama
              </label>
              <textarea
                name="complaints"
                id="complaints"
                value={formData.complaints}
                onChange={handleInputChange}
                rows={3}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bloodPressure"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tekanan Darah (mmHg)
                </label>
                <input
                  type="number"
                  name="bloodPressure"
                  id="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  required
                  placeholder="cth: 120"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="respiratoryRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Laju Pernapasan (x/menit)
                </label>
                <input
                  type="number"
                  name="respiratoryRate"
                  id="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleInputChange}
                  required
                  placeholder="cth: 20"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="temperature"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Suhu Tubuh (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  id="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                  placeholder="cth: 36.5"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="oxygenSaturation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Saturasi Oksigen (%)
                </label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  id="oxygenSaturation"
                  value={formData.oxygenSaturation}
                  onChange={handleInputChange}
                  required
                  placeholder="cth: 98"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="symptomps"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gejala Lain (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="symptomps"
                id="symptomps"
                value={formData.symptomps}
                onChange={handleInputChange}
                placeholder="cth: mual, pusing, lemas"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || isSaving}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "Menganalisis..." : "Analisis Data Pasien (AI)"}
        </button>
      </form>

      {error && (
        <div
          className="mb-6 p-4 text-sm text-red-800 bg-red-100 rounded-lg shadow"
          role="alert"
        >
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {saveSuccessMessage && (
        <div
          className="mb-6 p-4 text-sm text-green-800 bg-green-100 rounded-lg shadow"
          role="alert"
        >
          <span className="font-bold">Sukses:</span> {saveSuccessMessage}
        </div>
      )}

      {aiResult && !("error" in aiResult && aiResult.error) && (
        <div className="mb-6 p-6 bg-white shadow-xl rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Hasil Analisis AI
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Tingkat Persetujuan BPJS:</strong>{" "}
              <span className="font-semibold text-gray-800">
                {aiResult.bpjsApprovalRate}%
              </span>
            </p>
            <p>
              <strong>Indikator BPJS:</strong>{" "}
              <span className="font-semibold text-gray-800">
                {aiResult.bpjsIndicator}
              </span>
            </p>
            <p>
              <strong>Status Dokter Rekomendasi:</strong>{" "}
              <span className="font-semibold text-gray-800">
                {aiResult.doctorStatus}
              </span>
            </p>
            <div>
              <p className="font-medium mb-1">
                <strong>Ringkasan AI & Rekomendasi:</strong>
              </p>
              <pre className="whitespace-pre-wrap bg-gray-50 p-3 border border-gray-200 rounded-md text-sm leading-relaxed">
                {aiResult.aiSummary}
              </pre>
            </div>
          </div>
          <button
            onClick={handleSaveData}
            disabled={isSaving || isAnalyzing}
            className="mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Menyimpan Data..." : "Simpan Data ke Database"}
          </button>
        </div>
      )}
>>>>>>> 8c5a2a3545d0b7a883b59e2dd4f4d59e99ff4d82
    </div>
  );
}
