'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  IconHelpCircle,
  IconHelpCircleFilled,
  IconSettings,
  IconSettingsFilled,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Pengaturan',
    href: '/dashboard/pengaturan',
    icon: IconSettings,
    iconFilled: IconSettingsFilled,
  },
  {
    title: 'Bantuan',
    href: '#',
    icon: IconHelpCircle,
    iconFilled: IconHelpCircleFilled,
  },
];

export function NavSecondary() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={pathname === item.href} asChild>
                <Link href={item.href}>
                  {pathname === item.href ? <item.iconFilled /> : <item.icon />}
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
