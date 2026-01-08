'use client';

import React from 'react';
import Link from 'next/link';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { Button } from '@/components/ui/Button';
import type { ContactInfoItem } from '@/types';

interface ContactInfoListProps {
  data: ContactInfoItem[];
  onEdit: (item: ContactInfoItem) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function ContactInfoList({ data, onEdit, onDelete, isLoading }: ContactInfoListProps) {
  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (item: ContactInfoItem) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {item.type}
        </span>
      ),
    },
    {
      key: 'label',
      label: 'Label',
      render: (item: ContactInfoItem) => (
        <span className="font-medium text-gray-900">{item.label}</span>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (item: ContactInfoItem) => (
        <span className="text-gray-900">{item.value}</span>
      ),
    },
    {
      key: 'href',
      label: 'Link',
      render: (item: ContactInfoItem) => (
        <span className="text-sm text-blue-600">{item.href || '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: ContactInfoItem) => (
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
          <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your contact details
          </p>
        </div>
        <Link href="/admin/contact/info/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact Info
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <EnhancedTable
          data={data}
          columns={columns}
          emptyMessage="No contact information yet. Click 'Add Contact Info' to get started."
        />
      )}
    </div>
  );
}


