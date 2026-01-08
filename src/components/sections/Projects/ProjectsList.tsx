'use client';

import React from 'react';
import Link from 'next/link';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectsListProps {
  data: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number) => void;
  isLoading?: boolean;
}

export function ProjectsList({
  data,
  onEdit,
  onDelete,
  onTogglePublish,
  isLoading,
}: ProjectsListProps) {
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item: Project) => (
        <div>
          <span className="font-medium text-gray-900">{item.title}</span>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
        </div>
      ),
    },
    {
      key: 'tech',
      label: 'Technologies',
      className: 'max-w-xs',
      render: (item: Project) => (
        <div className="flex flex-wrap gap-1">
          {item.tech.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded cursor-default"
            >
              {tech}
            </span>
          ))}
          {item.tech.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{item.tech.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Project) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (item.id) onTogglePublish(item.id);
          }}
          className={`
            px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
            ${
              item.isPublished
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }
          `}
        >
          {item.isPublished ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: Project) => (
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
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your portfolio projects and showcase your work
          </p>
        </div>
        <Link href="/admin/projects/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        null
      ) : data.length === 0 ? (
        <div className="py-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No projects</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by adding your first project to showcase your work.
            </p>
            <div className="mt-6">
              <Link href="/admin/projects/add">
                <Button className="cursor-pointer">
                  Add Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EnhancedTable
          data={data}
          columns={columns}
          emptyMessage="No projects yet. Click 'Add Project' to get started."
        />
      )}
    </div>
  );
}

