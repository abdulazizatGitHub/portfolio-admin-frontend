'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSkills, useDeleteSkill } from '@/lib/hooks';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { SkillCard } from '@/components/sections/Skills/SkillCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import {
  Plus,
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  Users,
  Zap,
  Brain,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Skill, SkillCategory } from '@/types/skills';

// Category configuration
interface CategoryConfig {
  value: SkillCategory;
  label: string;
  icon: LucideIcon;
  color: string;
}

const categories: CategoryConfig[] = [
  { value: 'frontend', label: 'Frontend', icon: Code2, color: 'var(--chart-2)' },
  { value: 'backend', label: 'Backend', icon: Server, color: 'var(--chart-1)' },
  { value: 'database', label: 'Database', icon: Database, color: 'var(--chart-3)' },
  { value: 'devops', label: 'DevOps', icon: Cloud, color: 'var(--chart-5)' },
  { value: 'tools', label: 'Tools', icon: Wrench, color: 'var(--chart-4)' },
  { value: 'soft', label: 'Soft Skills', icon: Users, color: 'var(--chart-6)' },
  { value: 'technical', label: 'Technical', icon: Zap, color: 'var(--chart-2)' },
  { value: 'ai', label: 'AI/ML', icon: Brain, color: 'var(--chart-3)' },
];

export default function SkillsPage() {
  const router = useRouter();
  const { data: skills = [], isLoading, error } = useSkills();
  const { success, error: showError } = useToast();
  const deleteSkill = useDeleteSkill();

  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Skill | null>(null);
  const isDeleting = deleteSkill.isPending;

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<SkillCategory, Skill[]> = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: [],
      soft: [],
      technical: [],
      ai: [],
    };

    skills.forEach((skill) => {
      if (skill.category in grouped) {
        grouped[skill.category].push(skill);
      }
    });

    return grouped;
  }, [skills]);

  // Get filtered skills for currently active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skillsByCategory[activeCategory] || [];
  }, [activeCategory, skills, skillsByCategory]);

  // Calculate stats
  const totalSkills = skills.length;
  const categoryCounts = useMemo(() => {
    const counts: Record<SkillCategory, number> = {
      frontend: 0,
      backend: 0,
      database: 0,
      devops: 0,
      tools: 0,
      soft: 0,
      technical: 0,
      ai: 0,
    };

    skills.forEach((skill) => {
      if (skill.category in counts) {
        counts[skill.category]++;
      }
    });

    return counts;
  }, [skills]);

  const handleEdit = (skill: Skill) => {
    router.push(`/admin/skills/edit/${skill.id}`);
  };

  const handleDeleteClick = (skill: Skill) => {
    setItemToDelete(skill);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteSkill.mutateAsync(itemToDelete.id);
      success('Skill deleted');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete skill');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
          <div className="text-red-500 mb-4 text-lg font-semibold">Error Loading Skills</div>
          <p className="text-[var(--text-secondary)] mb-6">
            We couldn&apos;t load your skills. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Skills"
        description="Manage your technical skills and proficiency levels."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Skills' }]}
        actions={
          <Button variant="primary" onClick={() => router.push('/admin/skills/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        }
      />

      {/* Category Filter - Wrapping Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {/* All Skills Filter */}
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
            activeCategory === 'all'
              ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          )}
        >
          <span>All</span>
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              activeCategory === 'all'
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
            )}
          >
            {totalSkills}
          </span>
        </button>

        {/* Category Filters */}
        {categories.map((category) => {
          const Icon = category.icon;
          const count = categoryCounts[category.value];
          const isActive = activeCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                isActive
                  ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded',
                  isActive
                    ? 'bg-[var(--primary-500)] text-white'
                    : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-4">
              {activeCategory === 'all' ? (
                <Plus size={32} className="text-[var(--text-tertiary)]" />
              ) : (
                React.createElement(
                  categories.find((c) => c.value === activeCategory)?.icon || Plus,
                  { size: 32, className: 'text-[var(--text-tertiary)]' }
                )
              )}
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {activeCategory === 'all'
                ? 'No Skills Yet'
                : `No ${categories.find((c) => c.value === activeCategory)?.label} Skills`}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
              {activeCategory === 'all'
                ? 'Add your first skill to get started.'
                : `You have not added any ${categories.find((c) => c.value === activeCategory)?.label.toLowerCase()} skills yet.`}
            </p>
            <Button variant="primary" onClick={() => router.push('/admin/skills/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isLoading && skills.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}
          </span>
          {activeCategory !== 'all' && (
            <>
              <span>•</span>
              <span>{categories.find((c) => c.value === activeCategory)?.label}</span>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
