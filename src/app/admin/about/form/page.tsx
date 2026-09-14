'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAboutContent, useCreateAboutSection, useUpdateAboutSection } from '@/lib/hooks';
import { AboutForm } from '@/components/sections/About/AboutForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { AboutSection } from '@/types';

export default function AboutFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = !!id;

  const { data, isLoading: isFetching } = useAboutContent();
  const createSection = useCreateAboutSection();
  const updateSection = useUpdateAboutSection();
  const { success, error: showError } = useToast();

  const [initialData, setInitialData] = useState<AboutSection | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && data && id) {
      const section = data.find((s) => s.id === id);
      if (section) {
        setInitialData(section);
      } else {
        showError('Section not found');
        router.push('/admin/about');
      }
    }
  }, [data, id, isEdit, showError, router]);

  const handleSubmit = async (formData: AboutSection) => {
    setIsLoading(true);
    try {
      const { id: sectionId, createdAt, updatedAt, ...payload } = formData;
      if (isEdit && id) {
        await updateSection.mutateAsync({ id, data: payload });
      } else {
        await createSection.mutateAsync(payload);
      }
      success(isEdit ? 'Section updated' : 'Section created');
      router.push('/admin/about');
    } catch (err) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} section`);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/about');
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
        title={isEdit ? 'Edit About Section' : 'Add About Section'}
        description={
          isEdit
            ? 'Update your about section details.'
            : 'Create a new section to showcase your expertise.'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'About', href: '/admin/about' },
          { label: isEdit ? 'Edit' : 'Add' },
        ]}
      />

      <AboutForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
