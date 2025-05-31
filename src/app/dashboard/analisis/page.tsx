import { getEmergencyAndNonEmergencyReports } from '@/db/data';
import { TrendAnalysisChart } from './trend-analysis-chart';

export default async function Analisis() {
  const data = await getEmergencyAndNonEmergencyReports();

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Analisis Tren</h1>
      </header>
      <main className="flex-1 p-8">
        <TrendAnalysisChart data={data} />
      </main>
    </div>
  );
}
