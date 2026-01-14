'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Star } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ProjectCard } from '@/components/sections/Projects/ProjectCard';
import { ProjectStatusFilter } from '@/components/sections/Projects/ProjectStatusFilter';
import { useToast } from '@/lib/hooks/useToast';
import { mockProjects } from '@/lib/data/mockData';
import type { Project, ProjectStatus } from '@/types/projects';
import { cn } from '@/lib/utils/cn';

import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export default function ProjectsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | 'all'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load projects
  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);
  }, []);

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

    // Filter by status
    if (activeStatus !== 'all') {
      filtered = filtered.filter(p => p.status === activeStatus);
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(p => p.featured);
    }

    return filtered;
  }, [projects, activeStatus, showFeaturedOnly]);

  const featuredCount = projects.filter(p => p.featured).length;

  const handleView = (project: Project) => {
    // Navigate to edit page for now (can create view page later)
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
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      success('Project deleted successfully');
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      showError('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        description="Curate and showcase your professional journey and technical accomplishments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Projects' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/projects/add')}
            className="rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Status Filter */}
        <ProjectStatusFilter
          activeStatus={activeStatus}
          onChange={setActiveStatus}
          counts={statusCounts}
        />

        {/* Featured Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={cn(
              'flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest',
              showFeaturedOnly
                ? 'border-[var(--warning-500)] bg-[var(--warning-50)] dark:bg-[var(--warning-900)]/20 text-[var(--warning-600)] shadow-lg shadow-[var(--warning-500)]/10'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]'
            )}
          >
            <Star className={cn('w-4 h-4', showFeaturedOnly && 'fill-current')} />
            <span>Featured Highlights</span>
            {featuredCount > 0 && (
              <div className={cn(
                'flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black',
                showFeaturedOnly
                  ? 'bg-[var(--warning-500)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
              )}>
                {featuredCount}
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-100)] dark:border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[var(--primary-500)] animate-spin"></div>
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-[var(--text-tertiary)]">Synchronizing...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center max-w-sm p-8 rounded-[32px] glass-panel border-dashed border-2 border-[var(--border-subtle)]">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-[24px] flex items-center justify-center bg-[var(--bg-base)] shadow-inner">
                    <Plus className="w-10 h-10 text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
                    {activeStatus === 'all' && !showFeaturedOnly
                      ? 'No projects found'
                      : showFeaturedOnly
                        ? 'No featured highlights'
                        : `No ${activeStatus} projects`}
                  </h3>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-8 leading-relaxed">
                    {activeStatus === 'all' && !showFeaturedOnly
                      ? 'Begin your narrative by adding your first project to the portfolio.'
                      : 'Try broadening your filters or create a new entry.'}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/admin/projects/add')}
                    className="w-full rounded-xl shadow-xl"
                  >
                    Create Your First Project
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Projects Grid
              <motion.div
                key={`${activeStatus}-${showFeaturedOnly}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
