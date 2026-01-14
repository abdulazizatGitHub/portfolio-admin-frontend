'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, History, Sparkles, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperience } from '@/lib/hooks';
import { ExperienceCard } from '@/components/sections/Experience/ExperienceCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortExperiences } from '@/lib/utils/experienceHelpers';
import type { ExperienceEntry } from '@/types';
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ExperiencePage() {
  const router = useRouter();
  const { data: initialData, isLoading } = useExperience();
  const { success, error: showError } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExperienceEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive experience data from initialData
  const experience = initialData ? sortExperiences(initialData) : [];

  const handleEdit = (entry: ExperienceEntry) => {
    router.push(`/admin/experience/edit/${entry.id}`);
  };

  const handleDeleteClick = (entry: ExperienceEntry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, call mutation here
      success('Experience entry deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete experience entry');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Header Architecture */}
      <PageHeader
        title="Experience"
        description="Manage your professional career and work history."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience' },
        ]}
        actions={
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="primary"
              onClick={() => router.push('/admin/experience/add')}
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-bold uppercase tracking-widest px-8 rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 border-0 group"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </motion.div>
        }
      />

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="lg" className="text-[var(--primary-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Loading History</span>
            </div>
          </div>
        ) : experience.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 rounded-[40px] glass-panel border-2 border-dashed border-white/5"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border border-[var(--primary-500)]/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-[var(--primary-500)]/10 flex items-center justify-center text-[var(--primary-500)] shadow-2xl shadow-[var(--primary-500)]/20">
                  <Briefcase size={32} />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--primary-500)]">
                <Sparkles size={16} />
              </div>
            </div>

            <div className="text-center max-w-sm space-y-4">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                No Experience Found
              </h3>
              <p className="text-sm font-medium text-[var(--text-tertiary)] leading-relaxed">
                You haven't added any professional experience yet. Add your career history to showcase your journey.
              </p>
              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={() => router.push('/admin/experience/add')}
                  className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-black uppercase tracking-widest px-10 py-6 rounded-2xl border border-white/10 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 relative"
          >
            {/* Timeline Line (Vertical) */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary-500)]/50 via-white/5 to-transparent pointer-events-none" />

            {experience.map((entry, index) => (
              entry && (
                <motion.div key={entry.id || index} variants={itemVariants} className="relative pl-12 md:pl-24">
                  {/* Timeline Node Point (Aligned with Icon) */}
                  <div className="absolute left-6 md:left-12 top-[72px] -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--bg-dark)] border-2 border-[var(--primary-500)] z-10 shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.5)]" />

                  <ExperienceCard
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
        !isLoading && experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 px-8 py-6 rounded-[32px] bg-white/[0.02] border border-white/5 border-dashed"
          >
            <div className="flex items-center gap-3">
              <History size={16} className="text-[var(--primary-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Total entries: {experience.length}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-3">
              <Layers size={16} className="text-[var(--accent-500)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Layout: Timeline View</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">Status: Active</span>
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
        title="Delete Experience"
        message={`Are you sure you want to delete "${itemToDelete?.organization}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div >
  );
}
