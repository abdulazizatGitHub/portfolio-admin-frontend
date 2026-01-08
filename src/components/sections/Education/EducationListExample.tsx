'use client';

import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/Table/DataTable';
import type { Column } from '@/components/ui/Table/DataTable';
import { Button } from '@/components/ui/Button';
import type { EducationEntry } from '@/types';

interface EducationListExampleProps {
  data: EducationEntry[];
  onEdit: (entry: EducationEntry) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function EducationListExample({
  data,
  onEdit,
  onDelete,
  isLoading,
}: EducationListExampleProps) {
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
      className: 'max-w-md',
      filterable: true,
      filterType: 'text',
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

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          emptyMessage="No education entries yet. Click 'Add Education' to get started."
          pagination={true}
          pageSize={10}
          sorting={true}
          filtering={true}
          searchable={true}
          searchPlaceholder="Search education entries..."
          searchKeys={['period', 'title', 'description']}
        />
      )}
    </div>
  );
}

