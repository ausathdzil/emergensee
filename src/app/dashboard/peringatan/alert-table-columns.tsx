'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert } from '@/db/schema';
import { cn } from '@/lib/utils';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconCopy,
  IconDots,
  IconEdit,
  IconLoader,
  IconTrash,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Alert>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'district',
    header: 'Lokasi',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === 'Tidak valid' ? 'destructive' : 'secondary'}
          className={cn(
            'px-1.5',
            status === 'Tertangani' && 'bg-blue-500/5 text-blue-500',
            status === 'Dalam penanganan' && 'bg-primary/5 text-primary',
            status === 'Terdeteksi' && 'bg-warning/5 text-amber-600'
          )}
        >
          {status === 'Tertangani' ? (
            <IconCircleCheck />
          ) : status === 'Dalam penanganan' ? (
            <IconLoader />
          ) : status === 'Terdeteksi' ? (
            <IconAlertCircle />
          ) : status === 'Tidak valid' ? (
            <IconCircleX />
          ) : null}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const formatted = createdAt.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return <div>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const alert = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(alert.id)}
            >
              <IconCopy />
              Salin ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconEdit />
              Ubah Detail
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconTrash />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
