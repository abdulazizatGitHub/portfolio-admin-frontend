'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useExperience, useCreateExperience, useUpdateExperience } from '@/lib/hooks';
import { ExperienceForm } from '@/components/sections/Experience/ExperienceForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { ExperienceEntry } from '@/types';

function ExperienceFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = !!id;

  const { data, isLoading: isFetching } = useExperience();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const { success, error: showError } = useToast();

  const [initialData, setInitialData] = useState<ExperienceEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && data && id) {
      const entry = data.find((e) => e.id === id);
      if (entry) {
        setInitialData(entry);
      } else {
        showError('Experience entry not found');
        router.push('/admin/experience');
      }
    }
  }, [data, id, isEdit, showError, router]);

  const handleSubmit = async (formData: ExperienceEntry) => {
    setIsLoading(true);
    try {
      const { id: entryId, overallPeriod, ...payload } = formData;
      if (isEdit && id) {
        await updateExperience.mutateAsync({ id, data: payload });
      } else {
        await createExperience.mutateAsync(payload);
      }
      success(isEdit ? 'Experience updated' : 'Experience created');
      router.push('/admin/experience');
    } catch (err) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} experience`);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/experience');
  };

  if (isEdit && (isFetching || !initialData)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Experience' : 'Add Experience'}
        description={
          isEdit ? 'Update your work experience details.' : 'Add a new work experience entry.'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience', href: '/admin/experience' },
          { label: isEdit ? 'Edit' : 'Add' },
        ]}
      />

      <ExperienceForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function ExperienceFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ExperienceFormContent />
    </Suspense>
  );
}
