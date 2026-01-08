'use client';

import React from 'react';
import Link from 'next/link';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { Button } from '@/components/ui/Button';
import type { SocialLink } from '@/types';

interface SocialLinksListProps {
  data: SocialLink[];
  onEdit: (link: SocialLink) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function SocialLinksList({ data, onEdit, onDelete, isLoading }: SocialLinksListProps) {
  const columns = [
    {
      key: 'platform',
      label: 'Platform',
      render: (item: SocialLink) => (
        <span className="font-medium text-gray-900">{item.platform}</span>
      ),
    },
    {
      key: 'url',
      label: 'URL',
      render: (item: SocialLink) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {item.url}
        </a>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: SocialLink) => (
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
          <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your social media profiles and links
          </p>
        </div>
        <Link href="/admin/contact/social/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Social Link
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
          emptyMessage="No social links yet. Click 'Add Social Link' to get started."
        />
      )}
    </div>
  );
}


