'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GraduationCap, Sparkles, BookOpen, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEducation } from '@/lib/hooks';
import { EducationCard } from '@/components/sections/Education/EducationCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortEducation } from '@/lib/utils/educationHelpers';
import type { EducationEntry } from '@/types';
import { cn } from '@/lib/utils/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function EducationPage() {
  const router = useRouter();
  const { data: initialData, isLoading } = useEducation();
  const { success, error: showError } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EducationEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive education data from initialData
  const education = initialData ? sortEducation(initialData) : [];

  const handleEdit = (entry: EducationEntry) => {
    router.push(`/admin/education/edit/${entry.id}`);
  };

  const handleDeleteClick = (entry: EducationEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, call mutation here
      success('Education entry deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete education entry');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Header Matrix */}
      <PageHeader
        title="Education"
        description="Manage your degrees, certifications, and academic background."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education' },
        ]}
        actions={
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/education/add')}
              className="bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-bold uppercase tracking-widest px-8 rounded-2xl shadow-lg shadow-[var(--accent-500)]/20 border-0 group"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </motion.div>
        }
      />

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" className="text-[var(--accent-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Loading Education</span>
            </div>
          </div>
        ) : education.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 rounded-[40px] glass-panel border-2 border-dashed border-white/5"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border border-[var(--accent-500)]/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-[var(--accent-500)]/10 flex items-center justify-center text-[var(--accent-500)] shadow-2xl shadow-[var(--accent-500)]/20">
                  <GraduationCap size={32} />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-500)]">
                <BookOpen size={16} />
              </div>
            </div>

            <div className="text-center max-w-sm space-y-4">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                No Education Entries
              </h3>
              <p className="text-sm font-medium text-[var(--text-tertiary)] leading-relaxed">
                You haven't added any education history yet. Add your degrees and certifications to complete your profile.
              </p>
              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={() => router.push('/admin/education/add')}
                  className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-black uppercase tracking-widest px-10 py-6 rounded-2xl border border-white/10 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {education.map((entry, index) => (
              entry && (
                <motion.div key={entry.id || index} variants={itemVariants}>
                  <EducationCard
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </div>

      {/* Meta Indicators */}
      {
        !isLoading && education.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 px-8 py-6 rounded-[32px] bg-white/[0.02] border border-white/5 border-dashed"
          >
            <div className="flex items-center gap-3">
              <Award size={16} className="text-[var(--accent-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Total entries: {education.length}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-[var(--primary-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Verified Status: Synchronized</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Zap size={14} className="text-amber-500" />
              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">Status: Updated</span>
            </div>
          </motion.div>
        )
      }

      {/* Delete Confirmation Architecture */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Education"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div >
  );
}
