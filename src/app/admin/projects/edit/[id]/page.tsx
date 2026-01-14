'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnhancedProjectForm } from '@/components/sections/Projects/EnhancedProjectForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { mockProjects } from '@/lib/data/mockData';
import type { ProjectFormData } from '@/types/projects';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [currentProject, setCurrentProject] = useState<ProjectFormData | null>(null);

  // Load project data
  useEffect(() => {
    setTimeout(() => {
      const project = mockProjects.find(p => p.id?.toString() === projectId);
      if (project) {
        setCurrentProject({
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
        });
        setIsLoadingProject(false);
      } else {
        showError('Project not found');
        router.push('/admin/projects');
      }
    }, 500);
  }, [projectId, showError, router]);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating project:', projectId, data);
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
              initialData={currentProject || undefined}
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
