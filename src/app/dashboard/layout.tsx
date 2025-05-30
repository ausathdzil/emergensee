import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col p-4">{children}</main>
    </SidebarProvider>
  );
}
