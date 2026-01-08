'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AboutSection } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/Table/DataTable';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { fetchAboutSections } from '@/lib/data/mockData';
import type { ColumnDef } from '@tanstack/react-table';

export default function AboutSectionsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AboutSection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load sections on mount
  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAboutSections();
      setSections(data);
    } catch (err) {
      showError('Failed to load sections');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit section
  const handleEdit = (section: AboutSection) => {
    router.push(`/admin/about/edit/${section.id}`);
  };

  // Handle delete click
  const handleDeleteClick = (section: AboutSection) => {
    setDeleteTarget(section);
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
      setSections((prev) => prev.filter((s) => s.id !== deleteTarget.id));

      success('Section deleted successfully');
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showError('Failed to delete section');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<AboutSection>[] = useMemo(
    () => [
      {
        id: 'roleTitle',
        accessorKey: 'roleTitle',
        header: 'Title',
        cell: ({ row }) => (
          <span className="font-medium text-[var(--text-primary)]">
            {row.original.roleTitle}
          </span>
        ),
      },
      {
        id: 'paragraphs',
        accessorKey: 'paragraphs',
        header: 'Content',
        cell: ({ row }) => (
          <div>
            <span className="text-sm text-[var(--text-secondary)] font-medium">
              {row.original.paragraphs.length} paragraph{row.original.paragraphs.length !== 1 ? 's' : ''}
            </span>
            {row.original.paragraphs[0] && (
              <p className="text-[var(--text-tertiary)] line-clamp-2 max-w-md mt-1 text-sm">
                {row.original.paragraphs[0]}
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'stats',
        accessorKey: 'stats',
        header: 'Stats',
        cell: ({ row }) => (
          <span className="text-sm text-[var(--text-secondary)]">
            {row.original.stats.length} stat{row.original.stats.length !== 1 ? 's' : ''}
          </span>
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

  return (
    <div>
      <PageHeader
        title="Resume Sections"
        description="Manage sections for your resume and about page"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'About' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/about/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search sections..."
        emptyMessage="No sections found"
        emptyDescription="Get started by adding your first section."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Section"
        message={`Are you sure you want to delete "${deleteTarget?.roleTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
