'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EducationForm } from '@/components/sections/Education/EducationForm';
import { Card } from '@/components/ui/Card';
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, this would call the API
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
    <>
      <PageHeader
        title="Add Education Entry"
        description="Add a new education entry to showcase your academic background"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education', href: '/admin/education' },
          { label: 'Add Entry' },
        ]}
      />

      <Card>
        <div className="p-6">
          <EducationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

