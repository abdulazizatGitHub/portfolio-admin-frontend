'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEducation } from '@/lib/hooks';
import { EducationForm } from '@/components/sections/Education/EducationForm';
import { Card } from '@/components/ui/Card';
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
      setEducationEntry(entry);
    }
  }, [data, params.id]);

  const handleSubmit = async (data: EducationEntry) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, this would call the API
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!educationEntry) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-gray-600 mb-4">Education entry not found</div>
            <button
              onClick={() => router.push('/admin/education')}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Back to Education
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Education Entry"
        description="Update the information for this education entry"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Education', href: '/admin/education' },
          { label: 'Edit Entry' },
        ]}
      />

      <Card>
        <div className="p-6">
          <EducationForm
            initialData={educationEntry}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

