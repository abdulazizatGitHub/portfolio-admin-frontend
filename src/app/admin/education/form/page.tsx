'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEducation, useCreateEducation, useUpdateEducation } from '@/lib/hooks';
import { EducationForm } from '@/components/sections/Education/EducationForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { EducationEntry } from '@/types';

function EducationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = !!id;

  const { data, isLoading: isFetching } = useEducation();
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const { success, error: showError } = useToast();

  const [initialData, setInitialData] = useState<EducationEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && data && id) {
      const entry = data.find((e) => e.id === id);
      if (entry) {
        setInitialData(entry);
      } else {
        showError('Education entry not found');
        router.push('/admin/education');
      }
    }
  }, [data, id, isEdit, showError, router]);

  const handleSubmit = async (formData: EducationEntry) => {
    setIsLoading(true);
    try {
      const { id: entryId, ...payload } = formData;
      if (isEdit && id) {
        await updateEducation.mutateAsync({ id, data: payload });
      } else {
        await createEducation.mutateAsync(payload);
      }
      success(isEdit ? 'Education updated' : 'Education created');
      router.push('/admin/education');
    } catch (err) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} education entry`);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/education');
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
        title={isEdit ? 'Edit Education' : 'Add Education'}
        description={isEdit ? 'Update your education details.' : 'Add a new education entry.'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education', href: '/admin/education' },
          { label: isEdit ? 'Edit' : 'Add' },
        ]}
      />

      <EducationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function EducationFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <EducationFormContent />
    </Suspense>
  );
}
