'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnhancedProjectForm } from '@/components/sections/Projects/EnhancedProjectForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useProject, useUpdateProject } from '@/lib/hooks';
import type { ProjectFormData } from '@/types/projects';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const { success, error: showError } = useToast();
  const { data: project, isLoading: isLoadingProject, isError } = useProject(projectId);
  const updateProject = useUpdateProject();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      await updateProject.mutateAsync({ id: projectId, data });
      success('Project updated successfully');
      router.push('/admin/projects');
    } catch (err) {
      showError('Failed to update project. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !project) {
    showError('Project not found');
    router.push('/admin/projects');
    return null;
  }

  const initialData: ProjectFormData = {
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    category: project.category,
    techStack: project.techStack,
    thumbnail: project.thumbnail,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    status: project.status,
    featured: project.featured,
    isPublished: project.isPublished,
    startDate: project.startDate,
    endDate: project.endDate,
    decisions: project.decisions || [],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Edit Project"
        description="Update your project details and settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
          { label: 'Edit Project' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1000px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EnhancedProjectForm
              initialData={initialData}
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
