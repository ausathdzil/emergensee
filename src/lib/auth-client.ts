/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [adminClient()],
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function signUp(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = signUpSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password, name } = validatedFields.data;

  const { data, error } = await authClient.signUp.email({
    email: email,
    password: password,
    name: name,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signIn(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = signInSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  const { data, error } = await authClient.signIn.email({
    email: email,
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}
