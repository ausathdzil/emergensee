'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser } from '@/db/actions';
import { User } from '@/db/schema';
import { Loader, SaveIcon } from 'lucide-react';
import { useActionState } from 'react';

export function EditProfileForm({ user }: { user: User }) {
  const updateUserWithId = updateUser.bind(null, user.id);
  const [state, formAction, isPending] = useActionState(updateUserWithId, null);

  return (
    <form className="w-full max-w-md space-y-6" action={formAction}>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          name="name"
          defaultValue={user.name}
          required
          maxLength={50}
        />
        {state && state.error && state.error.name && (
          <span className="text-destructive text-sm">{state.error.name}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" defaultValue={user.email} required />
        {state && state.error && state.error.email && (
          <span className="text-destructive text-sm">{state.error.email}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="current-password">Password Lama</Label>
        <Input
          id="current-password"
          name="current-password"
          type="password"
          required
          minLength={8}
        />
        {state && state.error && state.error.currentPassword && (
          <span className="text-destructive text-sm">
            {state.error.currentPassword}
          </span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="new-password">Password Baru</Label>
        <Input
          id="new-password"
          name="new-password"
          type="password"
          required
          minLength={8}
        />
        {state && state.error && state.error.newPassword && (
          <span className="text-destructive text-sm">
            {state.error.newPassword}
          </span>
        )}
      </div>

      <Button
        className="w-full"
        variant="secondary"
        size="lg"
        type="submit"
        disabled={isPending}
      >
        {isPending ? <Loader className=" animate-spin" /> : <SaveIcon />}
        Simpan
      </Button>

      {state && state.message && (
        <span className="text-primary text-sm">{state.message}</span>
      )}
    </form>
  );
}
