'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, FileText } from 'lucide-react';
import { useAboutContent, useDeleteAboutSection } from '@/lib/hooks';
import { AboutCard } from '@/components/sections/About/AboutCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortAboutSections } from '@/lib/utils/aboutHelpers';
import type { AboutSection } from '@/types';

export default function AboutPage() {
  const router = useRouter();
  const { data: initialData, isLoading } = useAboutContent();
  const { success, error: showError } = useToast();

  const deleteSection = useDeleteAboutSection();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AboutSection | null>(null);
  const isDeleting = deleteSection.isPending;

  // Accordion state - track which card is expanded (null = none, id = that card)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sections = initialData
    ? sortAboutSections(Array.isArray(initialData) ? initialData : [initialData])
    : [];

  const handleEdit = (section: AboutSection) => {
    router.push(`/admin/about/form?id=${section.id}`);
  };

  const handleDeleteClick = (section: AboutSection) => {
    setItemToDelete(section);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteSection.mutateAsync(itemToDelete.id);
      success('About section deleted');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete section');
    }
  };

  // Toggle accordion - if clicking same card, close it; otherwise open clicked card
  const handleToggle = (sectionId: string) => {
    setExpandedId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="About Me"
        description="Manage your professional bio and personal overview."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'About' }]}
        actions={
          <Button variant="primary" onClick={() => router.push('/admin/about/form')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        }
      />

      {/* Content */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-4">
              <User size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No Bio Sections
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
              Add your first bio section to share your story with visitors.
            </p>
            <Button variant="primary" onClick={() => router.push('/admin/about/form')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => {
              if (!section) return null;

              const sectionKey = String(section.id ?? `new-${index}`);

              return (
                <AboutCard
                  key={sectionKey}
                  section={section}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  isPrimary={index === 0}
                  isExpanded={expandedId === sectionKey}
                  onToggle={() => handleToggle(sectionKey)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isLoading && sections.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {sections.length} section{sections.length !== 1 ? 's' : ''}
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
        title="Delete Section"
        message={`Are you sure you want to delete "${itemToDelete?.roleTitle}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
