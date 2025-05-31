import { Badge } from '@/components/ui/badge';
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
  getEmergencyReports,
  getTotalReports,
} from '@/db/data';
import { Loader, TrendingDown, TrendingUp } from 'lucide-react';
import { Suspense } from 'react';
import { alertsDummy } from './peringatan/page';
import { SymptomsTrendChart } from './symptoms-trend-chart';

const totalReportsDummy = {
  today: 24,
  yesterday: 20,
};

const emergencyReportsDummy = {
  today: 10,
  yesterday: 12,
};

export default function Dashboard() {
  // const [totalReports, igdReports, activeAlerts, allAlerts, symptomsTrend] =
  //   await Promise.all([
  //     getTotalReports(),
  //     getEmergencyReports(),
  //     getActiveAlerts(),
  //     getReportsBySymptoms(),
  //   ]);

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
              <ActiveAlerts alerts={alertsDummy} />
            </div>
            <SymptomsTrendChart />
            <ActiveAlertsTable alerts={alertsDummy} />
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
  alerts,
}: {
  alerts: Awaited<ReturnType<typeof getActiveAlerts>>;
}) {
  const activeAlerts = alerts.filter((alert) => alert.status === 'Aktif');

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Peringatan Aktif</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {activeAlerts.length}
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

function ActiveAlertsTable({
  alerts,
}: {
  alerts: Awaited<ReturnType<typeof getActiveAlerts>>;
}) {
  const recentActiveAlerts = alerts
    .filter((alert) => alert.status === 'Aktif')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActiveAlerts.map((alert, i) => (
            <TableRow key={alert.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{alert.type}</TableCell>
              <TableCell>{alert.district}</TableCell>
              <TableCell>{alert.status}</TableCell>
              <TableCell>
                {alert.createdAt.toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
