'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User } from 'lucide-react';
import { PersonalProfile } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PersonalCard } from '@/components/sections/Personal/PersonalCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { fetchPersonalProfiles } from '@/lib/data/mockData';
import { sortProfiles } from '@/lib/utils/personalHelpers';

import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function PersonalProfilesPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [profiles, setProfiles] = useState<PersonalProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PersonalProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPersonalProfiles();
      setProfiles(sortProfiles(data));
    } catch (err) {
      showError('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (profile: PersonalProfile) => {
    router.push(`/admin/personal/form?id=${profile.id}`);
  };

  const handleSetDefault = async (profile: PersonalProfile) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfiles((prev) =>
        sortProfiles(prev.map((p) => ({
          ...p,
          isDefault: p.id === profile.id
        })))
      );
      success(`${profile.name} set as primary identity`);
    } catch (err) {
      showError('Failed to update primary profile');
    }
  };

  const handleDeleteClick = (profile: PersonalProfile) => {
    if (profile.isDefault) {
      showError('Cannot delete the primary identity');
      return;
    }
    setDeleteTarget(profile);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfiles((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      success('Profile removed successfully');
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showError('Failed to delete profile');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal Identity"
        description="Curate and manage your professional personas for varied presentation contexts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Personal' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/personal/form')}
            className="rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Identity
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-100)] dark:border-white/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--primary-500)] animate-spin"></div>
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-[var(--text-tertiary)] animate-pulse">Syncing Personas...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {profiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 glass-panel border-dashed border-2 border-[var(--border-subtle)] rounded-[40px] text-center px-10"
            >
              <div className="w-20 h-20 rounded-[24px] bg-[var(--bg-base)] shadow-inner flex items-center justify-center text-[var(--text-tertiary)] mb-6">
                <User size={36} />
              </div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 tracking-tight">Identity Nexus Empty</h3>
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-10 max-w-sm leading-relaxed">Your professional identity repository is currently void. Establish your first digital persona to begin.</p>
              <Button
                variant="primary"
                onClick={() => router.push('/admin/personal/form')}
                className="rounded-xl px-10 shadow-xl active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Initialize Profile
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            >
              {profiles.map((profile) => (
                <PersonalCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Dissolve Identity"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name}"? All associated metadata records will be purged.`}
        confirmText="Dissolve"
        cancelText="Preserve"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
