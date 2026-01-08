'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Star } from 'lucide-react';
import { PersonalProfile } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/Table/DataTable';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { fetchPersonalProfiles } from '@/lib/data/mockData';
import type { ColumnDef } from '@tanstack/react-table';

export default function PersonalProfilesPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [profiles, setProfiles] = useState<PersonalProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PersonalProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPersonalProfiles();
      setProfiles(data);
    } catch (err) {
      showError('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit profile
  const handleEdit = (profile: PersonalProfile) => {
    router.push(`/admin/personal/edit/${profile.id}`);
  };

  // Handle delete click
  const handleDeleteClick = (profile: PersonalProfile) => {
    if (profile.isDefault) {
      showError('Cannot delete the default profile');
      return;
    }
    setDeleteTarget(profile);
    setDeleteModalOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove from state
      setProfiles((prev) => prev.filter((p) => p.id !== deleteTarget.id));

      success('Profile deleted successfully');
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showError('Failed to delete profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<PersonalProfile>[] = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="font-medium text-[var(--text-primary)]">
            {row.original.name}
          </span>
        ),
      },
      {
        id: 'title',
        accessorKey: 'titlePrefix',
        header: 'Title',
        cell: ({ row }) => (
          <span className="text-[var(--text-primary)]">
            {row.original.titlePrefix}
          </span>
        ),
      },
      {
        id: 'roles',
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.slice(0, 2).map((role, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)]"
              >
                {role}
              </span>
            ))}
            {row.original.roles.length > 2 && (
              <span className="px-2 py-1 text-xs text-[var(--text-secondary)]">
                +{row.original.roles.length - 2}
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'default',
        accessorKey: 'isDefault',
        header: 'Default',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Star
              size={16}
              fill={row.original.isDefault ? 'var(--warning-500)' : 'none'}
              stroke={row.original.isDefault ? 'var(--warning-500)' : 'var(--text-tertiary)'}
            />
            <span className="text-[var(--text-secondary)]">
              {row.original.isDefault ? 'Yes' : 'No'}
            </span>
          </div>
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
              disabled={row.original.isDefault}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDeleteClick]
  );

  return (
    <div>
      <PageHeader
        title="Personal Profiles"
        description="Manage your personal profiles for different contexts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Personal' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/personal/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Profile
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={profiles}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search profiles..."
        emptyMessage="No profiles found"
        emptyDescription="Get started by adding your first profile."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Profile"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
