'use client';

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
import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, EditIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';

export const columns: ColumnDef<Alert>[] = [
  {
    accessorKey: 'type',
    header: 'Tipe',
  },
  {
    accessorKey: 'district',
    header: 'Location',
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(alert.id)}
            >
              <CopyIcon />
              Salin ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditIcon />
              Ubah Detail
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2Icon />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
