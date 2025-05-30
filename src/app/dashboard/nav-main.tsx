'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BellRingIcon,
  ChartLineIcon,
  CircleGaugeIcon,
  CogIcon,
  MapIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: CircleGaugeIcon,
  },
  {
    title: 'Epidemiologi',
    url: '/dashboard/epidemiologi',
    icon: MapIcon,
  },
  {
    title: 'Peringatan',
    url: '/dashboard/peringatan',
    icon: BellRingIcon,
  },
  {
    title: 'Analisis',
    url: '#',
    icon: ChartLineIcon,
  },
  {
    title: 'Pengaturan',
    url: '#',
    icon: CogIcon,
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
                  <item.icon />
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
