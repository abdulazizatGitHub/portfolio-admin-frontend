'use client';

import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T | string;
  direction: SortDirection;
}

export interface TableSortingProps<T> {
  sortConfig: SortConfig<T> | null;
  onSort: (key: string) => void;
}

export function TableSorting<T>({ sortConfig, onSort }: TableSortingProps<T>) {
  // This is a utility component, actual sorting logic is in DataTable
  return null;
}


