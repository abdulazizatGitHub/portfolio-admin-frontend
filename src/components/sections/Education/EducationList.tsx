'use client';

import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { EducationEntry } from '@/types';

interface EducationListProps {
  data: EducationEntry[];
  onEdit: (entry: EducationEntry) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function EducationList({ data, onEdit, onDelete, isLoading }: EducationListProps) {
  const columns: Column<EducationEntry>[] = [
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      filterable: true,
      filterType: 'text',
      render: (item: EducationEntry) => (
        <span className="font-medium text-gray-900">{item.period}</span>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true,
      filterType: 'text',
      render: (item: EducationEntry) => (
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
      render: (item: EducationEntry) => (
        <p className="text-gray-600 line-clamp-2">{item.description}</p>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: EducationEntry) => (
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
    return null; // Loading handled by parent
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education Entries</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your education history and qualifications
          </p>
        </div>
        <Link href="/admin/education/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Education
          </Button>
        </Link>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No education entries"
          description="Get started by adding your first education entry to showcase your academic background."
          actionLabel="Add Education Entry"
          onAction={() => window.location.href = '/admin/education/add'}
          icon={
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      ) : (
        <DataTable
          data={data}
          columns={columns}
          onRowClick={onEdit}
          emptyMessage="No education entries found"
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

