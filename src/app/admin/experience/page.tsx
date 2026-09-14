'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, FileText } from 'lucide-react';
import { useExperience, useDeleteExperience } from '@/lib/hooks';
import { ExperienceCard } from '@/components/sections/Experience/ExperienceCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortExperiences } from '@/lib/utils/experienceHelpers';
import type { ExperienceEntry } from '@/types';

export default function ExperiencePage() {
  const router = useRouter();
  const { data: initialData, isLoading } = useExperience();
  const { success, error: showError } = useToast();

  const deleteExperience = useDeleteExperience();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExperienceEntry | null>(null);
  const isDeleting = deleteExperience.isPending;

  // Accordion state - only one expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const experience = initialData ? sortExperiences(initialData) : [];

  const handleEdit = (entry: ExperienceEntry) => {
    router.push(`/admin/experience/form?id=${entry.id}`);
  };

  const handleDeleteClick = (entry: ExperienceEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteExperience.mutateAsync(itemToDelete.id);
      success('Experience entry deleted');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete entry');
    }
  };

  const handleToggle = (entryId: string) => {
    setExpandedId((prev) => (prev === entryId ? null : entryId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Experience"
        description="Manage your professional career and work history."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Experience' }]}
        actions={
          <Button variant="primary" onClick={() => router.push('/admin/experience/form')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        }
      />

      {/* Timeline Content */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : experience.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-4">
              <Briefcase size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Experience</h3>
            <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
              Add your work history to showcase your professional journey.
            </p>
            <Button variant="primary" onClick={() => router.push('/admin/experience/form')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Main Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[var(--border-subtle)]" />

            {/* Experience Cards */}
            <div className="space-y-4">
              {experience.map(
                (entry) =>
                  entry && (
                    <div key={entry.id} className="relative pl-12">
                      {/* Timeline Node */}
                      <div className="absolute left-5 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--primary-500)] border-2 border-[var(--bg-base)] z-10" />

                      <ExperienceCard
                        entry={entry}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        isExpanded={expandedId === entry.id}
                        onToggle={() => entry.id !== undefined && handleToggle(entry.id)}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isLoading && experience.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {experience.length} position{experience.length !== 1 ? 's' : ''}
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
        title="Delete Experience"
        message={`Are you sure you want to delete "${itemToDelete?.organization}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
