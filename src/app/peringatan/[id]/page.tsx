import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
import { getAlertById, getUserById } from '@/db/data';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconLoader,
} from '@tabler/icons-react';

interface AlertPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusBadge(status: string) {
  if (status === 'Tertangani')
    return (
      <Badge variant="secondary" className="bg-blue-500/5 text-blue-500 px-1.5">
        <IconCircleCheck />
        {status}
      </Badge>
    );
  if (status === 'Dalam penanganan')
    return (
      <Badge variant="secondary" className="bg-primary/5 text-primary px-1.5">
        <IconLoader />
        {status}
      </Badge>
    );
  if (status === 'Terdeteksi')
    return (
      <Badge variant="secondary" className="bg-warning/5 text-amber-600 px-1.5">
        <IconAlertCircle />
        {status}
      </Badge>
    );
  if (status === 'Tidak valid')
    return (
      <Badge variant="destructive" className="px-1.5">
        <IconCircleX />
        {status}
      </Badge>
    );
  return (
    <Badge variant="outline" className="px-1.5">
      {status}
    </Badge>
  );
}

export default async function Alert({ params }: AlertPageProps) {
  const { id } = await params;
  const alert = await getAlertById(id);

  let reviewerName = '-';
  if (alert.reviewedBy) {
    const reviewer = await getUserById(alert.reviewedBy);
    reviewerName = reviewer.name;
  }

  if (!alert) {
    return (
      <div className="p-8 text-center text-destructive">
        Peringatan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <main className="flex-1 flex flex-col items-center justify-center p-8 w-full">
        <Card className="w-full data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card data-[slot=card]:bg-gradient-to-t data-[slot=card]:shadow-xs">
          <CardHeader>
            <CardTitle>{alert.type}</CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground truncate max-w-xs md:max-w-sm lg:max-w-md">
                  {alert.district}, {alert.city}, {alert.province}
                </div>
                {getStatusBadge(alert.status)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Provinsi
                  </div>
                  <div>{alert.province}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Kota
                  </div>
                  <div>{alert.city}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Kecamatan
                  </div>
                  <div>{alert.district}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Tanggal Dibuat
                  </div>
                  <div>{new Date(alert.createdAt).toLocaleString('id-ID')}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Diperiksa Oleh
                  </div>
                  <div>{reviewerName.charAt(0).toUpperCase()}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    Catatan
                  </div>
                  <div>{alert.notes || '-'}</div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">
                  Gejala Terkait
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(alert.relatedSymptoms) &&
                  alert.relatedSymptoms.length > 0 ? (
                    alert.relatedSymptoms.map(
                      (symptom: string, idx: number) => (
                        <Badge key={idx} className="text-xs px-2 py-1">
                          {symptom}
                        </Badge>
                      )
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">
                  Analisis AI
                </div>
                {alert.aiAnalysis &&
                typeof alert.aiAnalysis === 'object' &&
                Object.keys(alert.aiAnalysis).length > 0 ? (
                  <div className="overflow-hidden rounded-lg border bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kunci</TableHead>
                          <TableHead>Nilai</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(alert.aiAnalysis).map(
                          ([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium text-muted-foreground">
                                {key}
                              </TableCell>
                              <TableCell>
                                {typeof value === 'object'
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end text-xs text-muted-foreground">
            Terakhir diperbarui:{' '}
            {new Date(alert.updatedAt).toLocaleString('id-ID')}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
