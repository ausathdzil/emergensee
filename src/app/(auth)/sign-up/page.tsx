'use client';

import { signUp } from '@/lib/auth-client';
import { useActionState } from 'react';

export default function SignUp() {
  const [state, formAction] = useActionState(signUp, null);

  return (
    <form action={formAction}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <input type="text" name="name" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
