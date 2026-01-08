'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Project } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ProjectsTable } from '@/components/sections/Projects/ProjectsTable';
import { ProjectDetailModal } from '@/components/sections/Projects/ProjectDetailModal';
import { ProjectFormModal } from '@/components/sections/Projects/ProjectFormModal';
import { useToast } from '@/lib/hooks/useToast';
import { mockProjects } from '@/lib/data/mockData';

export default function ProjectsPage() {
  const { success, error: showError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected items
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Form loading
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load projects on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle view project
  const handleView = (project: Project) => {
    setSelectedProject(project);
    setViewModalOpen(true);
  };

  // Handle create new project
  const handleCreate = () => {
    setEditingProject(null);
    setFormModalOpen(true);
  };

  // Handle edit project
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormModalOpen(true);
    setViewModalOpen(false); // Close detail modal if open
  };

  // Handle delete click
  const handleDeleteClick = (project: Project) => {
    setDeleteTarget(project);
    setDeleteModalOpen(true);
    setViewModalOpen(false); // Close detail modal if open
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove from state
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));

      success('Project deleted successfully');
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showError('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle save (create or update)
  const handleSave = async (projectData: Partial<Project>) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingProject) {
        // Update existing project
        const updatedProject: Project = {
          ...editingProject,
          ...projectData,
          updatedAt: new Date().toISOString(),
        } as Project;

        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? updatedProject : p))
        );

        success('Project updated successfully');
      } else {
        // Create new project
        const newProject: Project = {
          ...projectData,
          id: Math.max(...projects.map((p) => p.id || 0), 0) + 1,
          orderIndex: projects.length,
          isPublished: projectData.status === 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Project;

        setProjects((prev) => [newProject, ...prev]);

        success('Project created successfully');
      }

      setFormModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      showError('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle selection change (for bulk operations - future feature)
  const handleSelectionChange = (selectedIds: string[]) => {
    console.log('Selected projects:', selectedIds);
    // Can implement bulk operations here in the future
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Projects Management"
        description="Manage your portfolio projects and showcase your work"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Projects' },
        ]}
        actions={
          <button onClick={handleCreate} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" style={{ display: 'inline-block' }} />
            New Project
          </button>
        }
      />

      {/* Projects Table */}
      <ProjectsTable
        projects={projects}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onSelectionChange={handleSelectionChange}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedProject(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Project Form Modal (Create/Edit) */}
      <ProjectFormModal
        project={editingProject}
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
        isLoading={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
