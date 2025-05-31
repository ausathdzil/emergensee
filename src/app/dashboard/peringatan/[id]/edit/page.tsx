import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAlertById } from '@/db/data';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UpdateAlertForm } from './update-alert-form';

interface EditAlertProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAlert({ params }: EditAlertProps) {
  const { id } = await params;
  const alert = await getAlertById(id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <header className="border-b border-border p-4 w-full">
        <h1 className="text-center text-xl font-semibold">
          Perbarui Peringatan #{alert.id.slice(0, 8)}
        </h1>
      </header>
      <main className="@container/main flex-1 flex flex-col items-center justify-center p-8 w-full *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="w-full max-w-md mb-8">
          <CardHeader>
            <CardTitle>{alert.type}</CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground truncate max-w-xs md:max-w-sm lg:max-w-md">
                  {alert.district}, {alert.city}, {alert.province}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="px-1.5">Status: {alert.status}</Badge>
                  <Badge className="px-1.5">
                    Dibuat: {new Date(alert.createdAt).toLocaleString('id-ID')}
                  </Badge>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2 font-semibold">
              Catatan
            </div>
            <div className="text-sm mb-2">{alert.notes || '-'}</div>
          </CardContent>
        </Card>
        <UpdateAlertForm
          alertId={id}
          userId={session.user.id}
          currentStatus={alert.status}
          currentNotes={typeof alert.notes === 'string' ? alert.notes : ''}
        />
      </main>
    </div>
  );
}
