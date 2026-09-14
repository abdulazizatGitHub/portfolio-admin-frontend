'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { PersonalForm } from '@/components/sections/Personal/PersonalForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { usePersonalContent, useSavePersonalProfile } from '@/lib/hooks';
import type { PersonalProfile } from '@/types';

function PersonalFormContent() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { data: profile, isLoading: isFetching } = usePersonalContent();
  const saveProfile = useSavePersonalProfile();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!profile;

  const handleSubmit = async (formData: PersonalProfile, cvFile?: File) => {
    setIsLoading(true);
    try {
      await saveProfile.mutateAsync({ data: formData, cvFile });
      success(isEdit ? 'Profile updated' : 'Profile created');
      router.push('/admin/personal');
    } catch (err) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} profile`);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/personal');
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Profile' : 'Create Profile'}
        description={isEdit ? 'Update your personal details.' : 'Create your personal profile.'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Personal', href: '/admin/personal' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <PersonalForm
        initialData={profile || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function PersonalFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <PersonalFormContent />
    </Suspense>
  );
}
