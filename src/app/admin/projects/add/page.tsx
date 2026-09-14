'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedProjectForm } from '@/components/sections/Projects/EnhancedProjectForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import { useCreateProject } from '@/lib/hooks';
import type { ProjectFormData } from '@/types/projects';

export default function ProjectFormPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const createProject = useCreateProject();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      await createProject.mutateAsync(data);
      success('Project created successfully');
      router.push('/admin/projects');
    } catch (err) {
      showError('Failed to create project. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="New Project"
        description="Create a new project to showcase your work"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
          { label: 'New Project' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EnhancedProjectForm
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
