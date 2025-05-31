'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth-client';
import { IconLoader } from '@tabler/icons-react';
import { useActionState } from 'react';

export default function SignIn() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form className="w-full max-w-sm space-y-4" action={formAction}>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" placeholder="m@example.com" required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" required />
      </div>

      {state && state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <IconLoader className="animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  );
}
