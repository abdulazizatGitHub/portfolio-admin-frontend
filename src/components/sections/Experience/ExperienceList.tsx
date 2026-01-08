'use client';

import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ExperienceEntry } from '@/types';

interface ExperienceListProps {
  data: ExperienceEntry[];
  onEdit: (entry: ExperienceEntry) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function ExperienceList({ data, onEdit, onDelete, isLoading }: ExperienceListProps) {
  const columns: Column<ExperienceEntry>[] = [
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      filterable: true,
      filterType: 'text',
      render: (item: ExperienceEntry) => (
        <span className="font-medium text-gray-900">{item.period}</span>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true,
      filterType: 'text',
      render: (item: ExperienceEntry) => (
        <span className="text-gray-900">{item.title}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      filterable: true,
      filterType: 'text',
      className: 'max-w-md',
      render: (item: ExperienceEntry) => (
        <p className="text-gray-600 line-clamp-2">{item.description}</p>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: ExperienceEntry) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="cursor-pointer"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (item.id) onDelete(item.id);
            }}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experience Entries</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your work experience and professional history
          </p>
        </div>
        <Link href="/admin/experience/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </Button>
        </Link>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No experience entries"
          description="Get started by adding your first work experience entry to showcase your professional background."
          actionLabel="Add Experience Entry"
          onAction={() => window.location.href = '/admin/experience/add'}
          icon={
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <DataTable
          data={data}
          columns={columns}
          onRowClick={onEdit}
          emptyMessage="No experience entries found"
          searchKeys={['period', 'title', 'description']}
          pagination
          sorting
          filtering
          searchable
        />
      )}
    </div>
  );
}

