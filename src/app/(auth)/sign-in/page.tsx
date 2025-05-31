'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth-client';
import { IconLoader } from '@tabler/icons-react';
import Link from 'next/link';
import { useActionState } from 'react';

export default function SignIn() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <div className="w-full max-w-sm space-y-6 mx-auto">
      <div className="flex flex-col items-center gap-2 mb-2">
        <Logo />
        <span className="text-xl font-bold text-primary">EmergenSee</span>
        <span className="text-muted-foreground text-sm">
          Masuk ke akun Anda
        </span>
      </div>
      <form className="space-y-4" action={formAction}>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
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
      <div className="pt-2 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link
          href="/sign-up"
          className="text-primary hover:underline font-medium"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}
