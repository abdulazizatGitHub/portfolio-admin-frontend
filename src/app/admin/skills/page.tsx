'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSkills } from '@/lib/hooks';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { SkillCard } from '@/components/sections/Skills/SkillCard';
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
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Skill, SkillCategory } from '@/types/skills';

// Category configuration
interface CategoryConfig {
  value: SkillCategory;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

const categories: CategoryConfig[] = [
  {
    value: 'frontend',
    label: 'Frontend',
    icon: Code2,
    color: 'var(--chart-2)',
    description: 'UI frameworks and client-side development',
  },
  {
    value: 'backend',
    label: 'Backend',
    icon: Server,
    color: 'var(--chart-1)',
    description: 'Server-side technologies and APIs',
  },
  {
    value: 'database',
    label: 'Database',
    icon: Database,
    color: 'var(--chart-3)',
    description: 'Data storage and management',
  },
  {
    value: 'devops',
    label: 'DevOps',
    icon: Cloud,
    color: 'var(--chart-5)',
    description: 'Infrastructure and deployment',
  },
  {
    value: 'tools',
    label: 'Tools',
    icon: Wrench,
    color: 'var(--chart-4)',
    description: 'Development tools and productivity',
  },
  {
    value: 'soft',
    label: 'Soft Skills',
    icon: Users,
    color: 'var(--chart-6)',
    description: 'Communication and collaboration',
  },
  {
    value: 'technical',
    label: 'Technical',
    icon: Zap,
    color: 'var(--chart-2)',
    description: 'General technical skills and methodologies',
  },
  {
    value: 'ai',
    label: 'AI/ML',
    icon: Brain,
    color: 'var(--chart-3)',
    description: 'Artificial Intelligence and Machine Learning',
  },
];

import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export default function SkillsPage() {
  const router = useRouter();
  const { data: initialData, isLoading, error } = useSkills();
  const { success, error: showError } = useToast();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSkills(initialData);
    }
  }, [initialData]);

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
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSkills(skills.filter((s) => s.id !== itemToDelete.id));
      success('Skill deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete skill');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 rounded-[32px] glass-panel bg-red-50/50 dark:bg-red-900/10 border-red-500/20">
          <div className="text-[var(--error-500)] mb-4 text-xl font-black uppercase tracking-widest">
            Synchronization Error
          </div>
          <p className="text-[var(--text-secondary)] mb-6 font-medium">We encountered an issue retrieving your technical archives.</p>
          <Button onClick={() => window.location.reload()} variant="primary" className="rounded-xl px-8 shadow-xl shadow-[var(--primary-500)]/20">
            Re-synchronize
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Technical Arsenal"
        description="A comprehensive mapping of your technical stack and proficiency spectrum"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/skills/add')}
            className="rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Acquisition
          </Button>
        }
      />

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide px-1"
      >
        {/* All Skills Filter */}
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-[11px] font-black uppercase tracking-widest',
            activeCategory === 'all'
              ? 'border-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] shadow-lg shadow-[var(--primary-500)]/10'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]'
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black shadow-sm",
            activeCategory === 'all' ? "bg-[var(--primary-500)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
          )}>
            {totalSkills}
          </div>
          <span>Comprehensive</span>
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
                'flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-[11px] font-black uppercase tracking-widest',
                isActive
                  ? 'shadow-lg'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]'
              )}
              style={{
                color: isActive ? category.color : undefined,
                backgroundColor: isActive ? `${category.color}15` : undefined,
                borderColor: isActive ? category.color : undefined,
                boxShadow: isActive ? `0 10px 15px -3px ${category.color}20` : undefined
              }}
              title={category.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{category.label}</span>
              <div
                className={cn(
                  'flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-lg text-[10px] font-black shadow-sm transition-all',
                  isActive ? 'bg-current text-white transform scale-110' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                )}
                style={{ backgroundColor: isActive ? category.color : undefined }}
              >
                {count}
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Skills List */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-100)] dark:border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[var(--primary-500)] animate-spin"></div>
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-[var(--text-tertiary)]">Analyzing Proficiency...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSkills.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center max-w-sm p-10 rounded-[32px] glass-panel border-dashed border-2 border-[var(--border-subtle)]">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-[24px] flex items-center justify-center bg-[var(--bg-base)] shadow-inner">
                    {activeCategory === 'all' ? (
                      <Plus className="w-10 h-10 text-[var(--text-tertiary)]" />
                    ) : (
                      React.createElement(
                        categories.find(c => c.value === activeCategory)?.icon || Plus,
                        {
                          className: "w-10 h-10",
                          style: { color: categories.find(c => c.value === activeCategory)?.color }
                        }
                      )
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
                    {activeCategory === 'all'
                      ? 'No skills identified'
                      : `No ${categories.find(c => c.value === activeCategory)?.label.toLowerCase()} expertise`}
                  </h3>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-8 leading-relaxed">
                    {activeCategory === 'all'
                      ? 'Begin documenting your technical journey by adding your first acquisition.'
                      : `You haven't added any ${categories.find(c => c.value === activeCategory)?.label.toLowerCase()} skills to your arsenal yet.`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/admin/skills/add')}
                    className="w-full rounded-xl shadow-xl active:scale-95 transition-transform"
                  >
                    Add Acquisition
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Skills Grid
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
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
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
