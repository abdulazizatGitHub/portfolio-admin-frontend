'use client';

import { useState } from 'react';
import { usePersonalContent } from '@/lib/hooks';
import { PersonalForm } from '@/components/forms/PersonalForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { PersonalContentFormData } from '@/lib/utils/validation';

export default function PersonalPage() {
  const { data, isLoading, error } = usePersonalContent();
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState(data);

  const handleSubmit = async (formData: PersonalContentFormData) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedData(formData as any);
    setIsSaving(false);
    alert('Personal content saved successfully! (This is a mock save)');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading personal content</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Personal Content</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </CardHeader>
        <CardBody>
          <PersonalForm
            initialData={savedData || data}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        </CardBody>
      </Card>
    </div>
  );
}

