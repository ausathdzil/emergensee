import { createAuthClient } from 'better-auth/react';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
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
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;

  const { data, error } = await authClient.signUp.email({
    email: email,
    password: password,
    name: name,
    fetchOptions: {
      onSuccess: () => {
        redirect('/dashboard');
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signIn(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = signInSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedFields.data;

  const { data, error } = await authClient.signIn.email({
    email: email,
    password: password,
    fetchOptions: {
      onSuccess: () => {
        redirect('/dashboard');
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
}
