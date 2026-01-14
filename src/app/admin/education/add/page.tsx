'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EducationForm } from '@/components/sections/Education/EducationForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import type { EducationEntry } from '@/types';

export default function AddEducationPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EducationEntry) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating education entry:', data);
      success('Education entry created successfully');
      router.push('/admin/education');
    } catch (err) {
      showError('Failed to create education entry. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/education');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Add Education"
        description="Add a new education entry to showcase your academic background"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education', href: '/admin/education' },
          { label: 'Add Education' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EducationForm
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
