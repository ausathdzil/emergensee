'use client';

import { signIn } from '@/lib/auth-client';
import { useActionState } from 'react';

export default function SignIn() {
  const [state, formAction] = useActionState(signIn, null);

  return (
    <form action={formAction}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  );
}
