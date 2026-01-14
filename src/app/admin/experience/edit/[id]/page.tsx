'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExperience } from '@/lib/hooks';
import { ExperienceForm } from '@/components/sections/Experience/ExperienceForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { ExperienceEntry } from '@/types';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading: isFetching } = useExperience();
  const { success, error: showError } = useToast();
  const [experienceEntry, setExperienceEntry] = useState<ExperienceEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data && params.id) {
      const entry = data.find((e) => e.id === Number(params.id));
      if (entry) {
        setExperienceEntry(entry);
      } else {
        showError('Experience entry not found');
        router.push('/admin/experience');
      }
    }
  }, [data, params.id, showError, router]);

  const handleSubmit = async (data: ExperienceEntry) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating experience entry:', data);
      success('Experience entry updated successfully');
      router.push('/admin/experience');
    } catch (err) {
      showError('Failed to update experience entry. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/experience');
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!experienceEntry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Edit Experience"
        description="Update your work experience entry details"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience', href: '/admin/experience' },
          { label: 'Edit Experience' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <ExperienceForm
              initialData={experienceEntry}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
