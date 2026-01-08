'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExperience } from '@/lib/hooks';
import { ExperienceForm } from '@/components/sections/Experience/ExperienceForm';
import { Card } from '@/components/ui/Card';
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
      setExperienceEntry(entry);
    }
  }, [data, params.id]);

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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!experienceEntry) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-gray-600 mb-4">Experience entry not found</div>
            <button
              onClick={() => router.push('/admin/experience')}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Back to Experience
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Experience Entry"
        description="Update the information for this experience entry"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Experience', href: '/admin/experience' },
          { label: 'Edit Entry' },
        ]}
      />

      <Card>
        <div className="p-6">
          <ExperienceForm
            initialData={experienceEntry}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

