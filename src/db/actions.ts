/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { db } from '.';
import { account, user } from './schema';

const UpdateUserFormSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export async function updateUser(
  userId: string,
  prevState: any,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    currentPassword: formData.get('current-password'),
    newPassword: formData.get('new-password'),
  };

  const validatedFields = UpdateUserFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, currentPassword, newPassword } = validatedFields.data;

  const [currentUser] = await db
    .select()
    .from(account)
    .where(eq(account.userId, userId));

  const ctx = await auth.$context;
  const isPasswordMatch = await ctx.password.verify({
    password: currentPassword,
    hash: currentUser.password!,
  });

  if (!isPasswordMatch) {
    return { error: { currentPassword: ['Password salah'] } };
  }

  const newPasswordHash = await ctx.password.hash(newPassword);

  await db
    .update(account)
    .set({
      password: newPasswordHash,
    })
    .where(eq(account.userId, userId));

  await db
    .update(user)
    .set({
      name,
      email,
    })
    .where(eq(user.id, userId));

  revalidatePath('/dashboard/pengaturan');

  return {
    message: 'Berhasil mengubah profil',
  };
}
