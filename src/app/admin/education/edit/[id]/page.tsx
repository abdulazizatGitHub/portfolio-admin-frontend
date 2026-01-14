'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEducation } from '@/lib/hooks';
import { EducationForm } from '@/components/sections/Education/EducationForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { EducationEntry } from '@/types';

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading: isFetching } = useEducation();
  const { success, error: showError } = useToast();
  const [educationEntry, setEducationEntry] = useState<EducationEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data && params.id) {
      const entry = data.find((e) => e.id === Number(params.id));
      if (entry) {
        setEducationEntry(entry);
      } else {
        showError('Education entry not found');
        router.push('/admin/education');
      }
    }
  }, [data, params.id, showError, router]);

  const handleSubmit = async (data: EducationEntry) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating education entry:', data);
      success('Education entry updated successfully');
      router.push('/admin/education');
    } catch (err) {
      showError('Failed to update education entry. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/education');
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!educationEntry) {
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
        title="Edit Education"
        description="Update your education entry details"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education', href: '/admin/education' },
          { label: 'Edit Education' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EducationForm
              initialData={educationEntry}
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
