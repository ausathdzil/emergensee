'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert } from '@/db/schema';
import { IconChevronDown } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const original = row.original as Record<string, unknown>;
      return Object.values(original).some((value) =>
        String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      );
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const uniqueCities = useMemo(() => {
    const cities = (data as Alert[]).map((item) => item.city).filter(Boolean);
    return Array.from(new Set(cities));
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Cari peringatan..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="relative">
          <select
            className="w-56 rounded-lg border px-3 py-2 appearance-none truncate bg-background text-sm"
            value={(table.getColumn('city')?.getFilterValue() as string) ?? ''}
            onChange={(e) =>
              table
                .getColumn('city')
                ?.setFilterValue(e.target.value || undefined)
            }
          >
            <option value="">Kota</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <IconChevronDown className="absolute size-4 right-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="relative">
          <select
            className="w-56 rounded-lg border px-3 py-2 appearance-none truncate bg-background text-sm"
            value={
              (table.getColumn('status')?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              table
                .getColumn('status')
                ?.setFilterValue(e.target.value || undefined)
            }
          >
            <option value="">Status</option>
            <option value="Tertangani">Tertangani</option>
            <option value="Dalam penanganan">Dalam penanganan</option>
            <option value="Terdeteksi">Terdeteksi</option>
            <option value="Tidak valid">Tidak valid</option>
          </select>
          <IconChevronDown className="absolute size-4 right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
