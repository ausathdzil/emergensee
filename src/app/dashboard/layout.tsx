import { SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { AppSidebar } from './app-sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== 'admin') {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
