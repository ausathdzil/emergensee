'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateAlert } from '@/db/actions';
import { IconChevronDown, IconLoader } from '@tabler/icons-react';
import { useActionState } from 'react';

export function UpdateAlertForm({
  alertId,
  userId,
  currentStatus,
  currentNotes,
}: {
  alertId: string;
  userId: string;
  currentStatus: string;
  currentNotes?: string;
}) {
  const updateAlertWithId = updateAlert.bind(null, userId);
  const [state, formAction, isPending] = useActionState(
    updateAlertWithId,
    null
  );

  return (
    <form action={formAction} className="space-y-4 w-full max-w-md">
      <input type="hidden" name="alert-id" value={alertId} />

      <div className="space-y-1">
        <Label htmlFor="status">Status</Label>
        <div className="relative">
          <select
            id="status"
            name="status"
            defaultValue={currentStatus}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring appearance-none text-sm"
            required
          >
            <option value="Terdeteksi">Terdeteksi</option>
            <option value="Dalam penanganan">Dalam penanganan</option>
            <option value="Tertangani">Tertangani</option>
            <option value="Tidak valid">Tidak valid</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">Catatan</Label>
        <Input
          id="notes"
          type="text"
          name="notes"
          defaultValue={currentNotes || ''}
          placeholder="Tambahkan catatan (opsional)"
        />
      </div>

      {state && state.error && (
        <div className="text-destructive text-sm">
          {state.error.alertId?.[0] ||
            state.error.notes?.[0] ||
            state.error.status?.[0] ||
            'Terjadi kesalahan'}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <IconLoader className="animate-spin" /> : 'Perbarui'}
      </Button>
    </form>
  );
}
