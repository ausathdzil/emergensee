/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { db } from '.';
import { account, alerts, user } from './schema';
import { redirect } from 'next/navigation';

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

const UpdateAlertFormSchema = z.object({
  alertId: z.string().min(1),
  status: z.enum([
    'Terdeteksi',
    'Dalam penanganan',
    'Tertangani',
    'Tidak valid',
  ]),
  notes: z.string().min(1).max(255),
});

export async function updateAlert(
  userId: string,
  prevState: any,
  formData: FormData
) {
  const rawFormData = {
    alertId: formData.get('alert-id'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  };

  const validatedFields = UpdateAlertFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { alertId, status, notes } = validatedFields.data;

  await db
    .update(alerts)
    .set({
      status: status,
      notes: notes,
      reviewedBy: userId,
    })
    .where(eq(alerts.id, alertId));

  revalidatePath(`/dashboard/peringatan/${alertId}`);
  redirect(`/dashboard/peringatan/${alertId}`);
}
