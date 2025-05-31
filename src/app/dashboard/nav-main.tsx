'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconChartAreaLine,
  IconChartAreaLineFilled,
  IconDashboard,
  IconDashboardFilled,
  IconMapPin,
  IconMapPinFilled
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconDashboard,
    iconFilled: IconDashboardFilled,
  },
  {
    title: 'Epidemiologi',
    url: '/dashboard/epidemiologi',
    icon: IconMapPin,
    iconFilled: IconMapPinFilled,
  },
  {
    title: 'Peringatan',
    url: '/dashboard/peringatan',
    icon: IconAlertTriangle,
    iconFilled: IconAlertTriangleFilled,
  },
  {
    title: 'Analisis',
    url: '/dashboard/analisis',
    icon: IconChartAreaLine,
    iconFilled: IconChartAreaLineFilled,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={pathname === item.url} asChild>
                <Link href={item.url}>
                  {pathname === item.url ? <item.iconFilled /> : <item.icon />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
