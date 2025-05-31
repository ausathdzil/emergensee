'use client';

import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  IconBrandWhatsapp,
  IconCopy,
  IconEdit,
  IconShare,
  IconShare2,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';

export function ReportActions({ id }: { id: string }) {
  return (
    <CardAction>
      <TooltipProvider>
        <div className="flex gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/dashboard/peringatan/${id}/edit`}>
                <Button variant="outline" size="icon" aria-label="Edit">
                  <IconEdit />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" aria-label="Hapus">
                <IconTrash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hapus</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" aria-label="Bagikan Laporan">
                    <IconShare />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_APP_URL}/peringatan/${id}`
                      )
                    }
                  >
                    <IconCopy />
                    Salin URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.share({
                        title: 'Bagikan Laporan',
                        text: 'Bagikan laporan ini kepada orang lain',
                        url: `${process.env.NEXT_PUBLIC_APP_URL}/peringatan/${id}`,
                      })
                    }
                  >
                    <IconShare2 />
                    Bagikan
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `${process.env.NEXT_PUBLIC_APP_URL}/peringatan/${id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconBrandWhatsapp />
                      WhatsApp
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>Bagikan</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </CardAction>
  );
}
