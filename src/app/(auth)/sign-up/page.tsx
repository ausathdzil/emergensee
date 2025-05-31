'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/auth-client';
import { IconLoader } from '@tabler/icons-react';
import Link from 'next/link';
import { useActionState } from 'react';

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <div className="w-full max-w-sm space-y-6 mx-auto">
      <div className="flex flex-col items-center gap-2 mb-2">
        <Logo />
        <span className="text-xl font-bold text-primary">EmergenSee</span>
        <span className="text-muted-foreground text-sm">Buat akun baru</span>
      </div>
      <form className="space-y-4" action={formAction}>
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
          <Input
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" required minLength={8} />
        </div>
        {state && state.error && (
          <p className="text-destructive text-sm">{state.error}</p>
        )}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <IconLoader className="animate-spin" /> : 'Sign Up'}
        </Button>
      </form>
      <div className="pt-2 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link
          href="/sign-in"
          className="text-primary hover:underline font-medium"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
