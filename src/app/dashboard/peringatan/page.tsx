import { Alert } from '@/db/schema';
import { columns } from './alert-table-columns';
import { DataTable } from './data-table';

export const alertsDummy: Alert[] = [
  {
    id: '1',
    type: 'Lonjakan Kasus IGD',
    district: 'Kebayoran Baru',
    status: 'Terdeteksi',
    createdAt: new Date('2024-06-01T08:00:00Z'),
    updatedAt: new Date('2024-06-01T09:00:00Z'),
    aiAnalysis: { risk: 'tinggi', confidence: 0.92 },
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    relatedSymptoms: ['Demam', 'Batuk'],
    reviewedBy: null,
    reviewedAt: null,
    notes: 'Perlu investigasi lebih lanjut.',
  },
  {
    id: '2',
    type: 'KLB DBD',
    district: 'Cilandak',
    status: 'Dalam penanganan',
    createdAt: new Date('2024-06-02T10:00:00Z'),
    updatedAt: new Date('2024-06-02T11:00:00Z'),
    aiAnalysis: { risk: 'tinggi', confidence: 0.95 },
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    relatedSymptoms: ['Demam', 'Nyeri Otot', 'Ruam'],
    reviewedBy: null,
    reviewedAt: null,
    notes: 'Kasus DBD meningkat signifikan.',
  },
  {
    id: '3',
    type: 'Keracunan Makanan Massal',
    district: 'Pancoran',
    status: 'Tertangani',
    createdAt: new Date('2024-06-03T12:00:00Z'),
    updatedAt: new Date('2024-06-03T13:00:00Z'),
    aiAnalysis: { risk: 'sedang', confidence: 0.78 },
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    relatedSymptoms: ['Mual', 'Muntah', 'Diare'],
    reviewedBy: 'user-1',
    reviewedAt: new Date('2024-06-03T14:00:00Z'),
    notes: 'Sudah ditangani oleh dinas kesehatan.',
  },
  {
    id: '4',
    type: 'Kasus Baru Hepatitis A',
    district: 'Tebet',
    status: 'Tidak valid',
    createdAt: new Date('2024-06-04T09:00:00Z'),
    updatedAt: new Date('2024-06-04T10:00:00Z'),
    aiAnalysis: { risk: 'rendah', confidence: 0.55 },
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    relatedSymptoms: ['Mual', 'Kuning', 'Lemas'],
    reviewedBy: 'user-2',
    reviewedAt: new Date('2024-06-04T11:00:00Z'),
    notes: 'Tidak ditemukan bukti wabah.',
  },
];

export default function Alerts() {
  // const alerts = await getAllAlerts()

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Peringatan Dini</h1>
      </header>
      <main className="flex-1 p-8">
        <DataTable columns={columns} data={alertsDummy} />
      </main>
    </div>
  );
}
