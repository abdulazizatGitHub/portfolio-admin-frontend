'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GraduationCap, FileText } from 'lucide-react';
import { useEducation, useDeleteEducation } from '@/lib/hooks';
import { EducationCard } from '@/components/sections/Education/EducationCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortEducation } from '@/lib/utils/educationHelpers';
import type { EducationEntry } from '@/types';

export default function EducationPage() {
  const router = useRouter();
  const { data: initialData, isLoading } = useEducation();
  const { success, error: showError } = useToast();

  const deleteEducation = useDeleteEducation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EducationEntry | null>(null);
  const isDeleting = deleteEducation.isPending;

  // Accordion state - only one expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const education = initialData ? sortEducation(initialData) : [];

  const handleEdit = (entry: EducationEntry) => {
    router.push(`/admin/education/form?id=${entry.id}`);
  };

  const handleDeleteClick = (entry: EducationEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteEducation.mutateAsync(itemToDelete.id);
      success('Education entry deleted');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete entry');
    }
  };

  const handleToggle = (entryId: string | undefined) => {
    if (entryId === undefined) return;
    setExpandedId((prev) => (prev === entryId ? null : entryId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Education"
        description="Manage your degrees, certifications, and academic background."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Education' }]}
        actions={
          <Button variant="primary" onClick={() => router.push('/admin/education/form')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        }
      />

      {/* Content */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : education.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-4">
              <GraduationCap size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No Education Entries
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
              Add your degrees and certifications to complete your profile.
            </p>
            <Button variant="primary" onClick={() => router.push('/admin/education/form')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {education.map(
              (entry) =>
                entry && (
                  <EducationCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => handleToggle(entry.id)}
                  />
                )
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isLoading && education.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {education.length} entr{education.length !== 1 ? 'ies' : 'y'}
          </span>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Education"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
