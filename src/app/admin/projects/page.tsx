'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Star, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ProjectCard } from '@/components/sections/Projects/ProjectCard';
import { ProjectStatusFilter } from '@/components/sections/Projects/ProjectStatusFilter';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useProjects, useDeleteProject } from '@/lib/hooks';
import type { Project, ProjectStatus } from '@/types/projects';
import { cn } from '@/lib/utils/cn';

export default function ProjectsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | 'all'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [displayCount, setDisplayCount] = useState(6); // Initial display limit

  const ITEMS_PER_PAGE = 6;
  const isDeleting = deleteProject.isPending;

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<ProjectStatus | 'all', number> = {
      all: projects.length,
      live: 0,
      draft: 0,
      development: 0,
      archived: 0,
    };

    projects.forEach((project) => {
      counts[project.status]++;
    });

    return counts;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (activeStatus !== 'all') {
      filtered = filtered.filter((p) => p.status === activeStatus);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter((p) => p.featured);
    }

    return filtered;
  }, [projects, activeStatus, showFeaturedOnly]);

  // Paginated projects (for display)
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayCount);
  }, [filteredProjects, displayCount]);

  const hasMore = displayCount < filteredProjects.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [activeStatus, showFeaturedOnly]);

  const featuredCount = projects.filter((p) => p.featured).length;

  const handleView = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete?.id) return;

    try {
      await deleteProject.mutateAsync(projectToDelete.id);
      success('Project deleted');
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      showError('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects and showcases."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Projects' }]}
        actions={
          <Button variant="primary" onClick={() => router.push('/admin/projects/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        }
      />

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <ProjectStatusFilter
          activeStatus={activeStatus}
          onChange={setActiveStatus}
          counts={statusCounts}
        />

        {/* Featured Toggle */}
        <button
          onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
            showFeaturedOnly
              ? 'border-amber-500 bg-amber-500/10 text-amber-600'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          )}
        >
          <Star className={cn('w-4 h-4', showFeaturedOnly && 'fill-current')} />
          <span>Featured</span>
          {featuredCount > 0 && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                showFeaturedOnly
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
              )}
            >
              {featuredCount}
            </span>
          )}
        </button>
      </div>

      {/* Projects Grid */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-4">
              <Plus size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {activeStatus === 'all' && !showFeaturedOnly
                ? 'No Projects Yet'
                : showFeaturedOnly
                  ? 'No Featured Projects'
                  : `No ${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Projects`}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
              {activeStatus === 'all' && !showFeaturedOnly
                ? 'Add your first project to start building your portfolio.'
                : 'Try adjusting your filters or add a new project.'}
            </p>
            <Button variant="primary" onClick={() => router.push('/admin/projects/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                >
                  Load More ({filteredProjects.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isLoading && projects.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </span>
          {activeStatus !== 'all' && (
            <>
              <span>•</span>
              <span>{activeStatus}</span>
            </>
          )}
          {showFeaturedOnly && (
            <>
              <span>•</span>
              <span>Featured only</span>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
