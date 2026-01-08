'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from '@/lib/utils/debounce';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: string;
  onRowClick?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onView?: (row: TData) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchKey,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No data available',
  emptyDescription = 'Get started by creating your first item.',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const debouncedSetGlobalFilter = useCallback(
    debounce((value: string) => {
      setGlobalFilter(value);
    }, 300),
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Add action column if actions provided
  const columnsWithActions = useMemo(() => {
    if (!onEdit && !onDelete && !onView) return columns;

    const actionsColumn: ColumnDef<TData, TValue> = {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors">
                <MoreHorizontal className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[150px] bg-[var(--bg-elevated)] rounded-lg shadow-lg border border-[var(--border-primary)] p-1 z-50"
                sideOffset={5}
              >
                {onView && (
                  <DropdownMenu.Item
                    onClick={() => onView(rowData)}
                    className="px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--text-primary)] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </DropdownMenu.Item>
                )}
                {onEdit && (
                  <DropdownMenu.Item
                    onClick={() => onEdit(rowData)}
                    className="px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--text-primary)] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </DropdownMenu.Item>
                )}
                {onDelete && (
                  <>
                    <DropdownMenu.Separator className="h-px bg-[var(--border-primary)] my-1" />
                    <DropdownMenu.Item
                      onClick={() => onDelete(rowData)}
                      className="px-3 py-2 rounded-md hover:bg-[var(--danger-bg)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--danger)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenu.Item>
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      },
    };

    return [...columns, actionsColumn];
  }, [columns, onEdit, onDelete, onView]);

  const tableWithActions = useReactTable({
    ...table.options,
    columns: columnsWithActions,
  });

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={56} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {/* Header with Search */}
        {searchable && (
          <div className="mb-6">
            <div className="flex items-center gap-2 max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGlobalFilter(value);
                    debouncedSetGlobalFilter(value);
                  }}
                  className="pl-10 w-[280px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-[var(--border-primary)] rounded-lg">
          <table className="min-w-full divide-y divide-[var(--border-primary)]">
            <thead className="bg-[var(--bg-tertiary)] sticky top-0 z-10">
              {tableWithActions.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'px-6 h-11 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider',
                        header.column.getCanSort() &&
                          'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      role="columnheader"
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-[var(--bg-elevated)] divide-y divide-[var(--border-primary)]">
              {tableWithActions.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'h-14 hover:bg-[var(--bg-tertiary)] transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 whitespace-nowrap text-sm text-[var(--text-primary)]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {tableWithActions.getRowModel().rows.length === 0 && (
          <div className="py-12">
            <EmptyState
              title={emptyMessage}
              description={emptyDescription}
              icon={
                <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Search className="w-8 h-8 text-[var(--text-secondary)]" />
                </div>
              }
            />
          </div>
        )}

        {/* Pagination */}
        {tableWithActions.getRowModel().rows.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-[var(--border-primary)] pt-4">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(table.getPageCount(), 5))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={cn(
                      'w-8 h-8 rounded-md text-sm font-medium transition-colors',
                      table.getState().pagination.pageIndex === i
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
