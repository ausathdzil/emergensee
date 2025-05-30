'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  CircleUserRoundIcon,
  CogIcon,
  FileUserIcon,
  FolderClockIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Pasien',
    url: '/dashboard',
    icon: FileUserIcon,
  },
  {
    title: 'Riwayat',
    url: '/dashboard/riwayat',
    icon: FolderClockIcon,
  },
  {
    title: 'Akun',
    url: '#',
    icon: CircleUserRoundIcon,
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
