'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExperience } from '@/lib/hooks';
import { DataTable } from '@/components/ui/Table/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/lib/hooks/useToast';
import { Plus } from 'lucide-react';
import type { ExperienceEntry } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ExperiencePage() {
  const router = useRouter();
  const { data: initialData, isLoading, error } = useExperience();
  const { success, error: showError } = useToast();
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setExperience(initialData);
    }
  }, [initialData]);

  const handleEdit = (entry: ExperienceEntry) => {
    router.push(`/admin/experience/edit/${entry.id}`);
  };

  const handleDeleteClick = (entry: ExperienceEntry) => {
    setItemToDelete(entry.id!);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setExperience(experience.filter((e) => e.id !== itemToDelete));
      success('Experience entry deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete experience entry');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<ExperienceEntry>[] = useMemo(
    () => [
      {
        id: 'organization',
        accessorKey: 'organization',
        header: 'Organization',
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-[var(--text-primary)] block">
              {row.original.organization}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {row.original.overallPeriod}
            </span>
          </div>
        ),
      },
      {
        id: 'roles',
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => {
          const roles = row.original.roles || [];
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            const [year, month] = dateStr.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = parseInt(month, 10) - 1;
            return `${monthNames[monthIndex]} ${year}`;
          };

          return (
            <div className="space-y-2">
              {roles.map((role, index) => {
                const period = role.isCurrent || !role.endDate
                  ? `${formatDate(role.startDate)} – Present`
                  : `${formatDate(role.startDate)} – ${formatDate(role.endDate)}`;
                
                return (
                  <div key={role.id || index} className="text-sm">
                    <div className="font-medium text-[var(--text-primary)]">
                      {role.jobTitle}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {period}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        id: 'description',
        accessorKey: 'roles',
        header: 'Description',
        cell: ({ row }) => {
          const roles = row.original.roles || [];
          const currentRole = roles.find(r => r.isCurrent) || roles[roles.length - 1];
          return (
            <p className="text-[var(--text-secondary)] line-clamp-2 max-w-md text-sm">
              {currentRole?.description || 'No description'}
            </p>
          );
        },
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
              Error loading experience entries
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
        title="Experience Management"
        description="Manage your work experience and professional background"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/experience/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={experience}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search experience entries..."
        emptyMessage="No experience entries found"
        emptyDescription="Get started by adding your first experience entry."
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Experience Entry"
        message="Are you sure you want to delete this experience entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
