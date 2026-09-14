'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceForm } from '@/components/sections/Experience/ExperienceForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import { useCreateExperience } from '@/lib/hooks';
import type { ExperienceEntry } from '@/types';

export default function AddExperiencePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const createExperience = useCreateExperience();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ExperienceEntry) => {
    setIsLoading(true);
    try {
      const { id, overallPeriod, ...payload } = data;
      await createExperience.mutateAsync(payload);
      success('Experience entry created successfully');
      router.push('/admin/experience');
    } catch (err) {
      showError('Failed to create experience entry. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/experience');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Add Experience"
        description="Add a new work experience entry to showcase your professional background"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience', href: '/admin/experience' },
          { label: 'Add Experience' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <ExperienceForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
