'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { useActionState } from 'react';

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <form className="w-full max-w-sm space-y-4" action={formAction}>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input
          type="text"
          name="name"
          placeholder="John Doe"
          required
          maxLength={50}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" placeholder="m@example.com" required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" required minLength={8} />
      </div>

      {state && state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Loader className="animate-spin" /> : 'Sign Up'}
      </Button>
    </form>
  );
}
