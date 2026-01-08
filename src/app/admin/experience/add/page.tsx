'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceForm } from '@/components/sections/Experience/ExperienceForm';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import type { ExperienceEntry } from '@/types';

export default function AddExperiencePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ExperienceEntry) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating experience entry:', data);
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
    <>
      <PageHeader
        title="Add Experience Entry"
        description="Add a new work experience entry to showcase your professional background"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience', href: '/admin/experience' },
          { label: 'Add Entry' },
        ]}
      />

      <Card>
        <div className="p-6">
          <ExperienceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

