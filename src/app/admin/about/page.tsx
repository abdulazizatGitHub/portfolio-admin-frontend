'use client';

import { useState } from 'react';
import { useAboutContent } from '@/lib/hooks';
import { AboutForm } from '@/components/forms/AboutForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function AboutPage() {
  const { data, isLoading, error } = useAboutContent();
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState(data);

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedData(formData);
    setIsSaving(false);
    alert('About content saved successfully! (This is a mock save)');
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
        <div className="text-red-600">Error loading about content</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About Content</h1>
        <p className="mt-2 text-gray-600">
          Manage your about section content
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">About Information</h2>
        </CardHeader>
        <CardBody>
          <AboutForm
            initialData={savedData || data}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        </CardBody>
      </Card>
    </div>
  );
}

