import { getAllAlerts } from '@/db/data';
import { columns } from './alert-table-columns';
import { DataTable } from './data-table';

export default async function Alerts() {
  const alerts = await getAllAlerts();

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Peringatan Dini</h1>
      </header>
      <main className="flex-1 p-8">
        <DataTable columns={columns} data={alerts} />
      </main>
    </div>
  );
}
