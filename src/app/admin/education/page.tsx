'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEducation } from '@/lib/hooks';
import { DataTable } from '@/components/ui/Table/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { Plus } from 'lucide-react';
import type { EducationEntry } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export default function EducationPage() {
  const router = useRouter();
  const { data: initialData, isLoading, error } = useEducation();
  const { success, error: showError } = useToast();
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setEducation(initialData);
    }
  }, [initialData]);

  const handleEdit = (entry: EducationEntry) => {
    router.push(`/admin/education/edit/${entry.id}`);
  };

  const handleDeleteClick = (entry: EducationEntry) => {
    setItemToDelete(entry.id!);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEducation(education.filter((e) => e.id !== itemToDelete));
      success('Education entry deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete education entry');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<EducationEntry>[] = useMemo(
    () => [
      {
        id: 'period',
        accessorKey: 'period',
        header: 'Period',
        cell: ({ row }) => (
          <span className="font-medium text-[var(--text-primary)]">
            {row.original.period}
          </span>
        ),
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="text-[var(--text-primary)]">
            {row.original.title}
          </span>
        ),
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <p className="text-[var(--text-secondary)] line-clamp-2 max-w-md">
            {row.original.description}
          </p>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row.original);
              }}
              className="text-[var(--error-500)] hover:text-[var(--error-600)]"
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDeleteClick]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-red-600 dark:text-red-400 mb-4">
              Error loading education entries
            </div>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Education Management"
        description="Manage your educational background and qualifications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/education/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={education}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search education entries..."
        emptyMessage="No education entries found"
        emptyDescription="Get started by adding your first education entry."
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Education Entry"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
