'use client';

import { useRouter } from 'next/navigation';
import { Plus, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PersonalCard } from '@/components/sections/Personal/PersonalCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePersonalContent } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';

import { motion } from 'framer-motion';

export default function PersonalProfilesPage() {
  const router = useRouter();
  const { data: profile, isLoading } = usePersonalContent();
  const { error: showError } = useToast();

  const handleEdit = () => {
    router.push('/admin/personal/form');
  };

  const handleDelete = () => {
    showError('The primary profile cannot be deleted.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal Profile"
        description="Manage your professional profile and personal information."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Personal' }]}
        actions={
          !profile ? (
            <Button
              variant="primary"
              onClick={() => router.push('/admin/personal/form')}
              className="rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-100)] dark:border-white/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--primary-500)] animate-spin"></div>
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-[var(--text-tertiary)] animate-pulse">
            Loading Profile...
          </p>
        </div>
      ) : !profile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 glass-panel border-dashed border-2 border-[var(--border-subtle)] rounded-[40px] text-center px-10"
        >
          <div className="w-20 h-20 rounded-[24px] bg-[var(--bg-base)] shadow-inner flex items-center justify-center text-[var(--text-tertiary)] mb-6">
            <User size={36} />
          </div>
          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
            No Profile Yet
          </h3>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-10 max-w-sm leading-relaxed">
            Create your personal profile to appear on the public portfolio.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/admin/personal/form')}
            className="rounded-xl px-10 shadow-xl active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PersonalCard profile={profile} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
