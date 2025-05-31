import { SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { AppSidebar } from './app-sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== 'admin') {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <ViewTransition name="fade">{children}</ViewTransition>
    </SidebarProvider>
  );
}
