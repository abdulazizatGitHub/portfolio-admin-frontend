'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSkills } from '@/lib/hooks';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { Plus, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import * as Tabs from '@radix-ui/react-tabs';
import type { Skill } from '@/types';

export default function SkillsPage() {
  const router = useRouter();
  const { data: initialData, isLoading, error } = useSkills();
  const { success, error: showError } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<'technical' | 'ai'>('technical');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSkills(initialData);
    }
  }, [initialData]);

  const technicalSkills = useMemo(
    () => skills.filter((s) => s.category === 'technical'),
    [skills]
  );
  const aiSkills = useMemo(
    () => skills.filter((s) => s.category === 'ai'),
    [skills]
  );

  const currentSkills = activeTab === 'technical' ? technicalSkills : aiSkills;

  const handleEdit = (skill: Skill) => {
    router.push(`/admin/skills/edit/${skill.id}`);
  };

  const handleDeleteClick = (skill: Skill) => {
    setItemToDelete(skill.id!);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSkills(skills.filter((s) => s.id !== itemToDelete));
      success('Skill deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete skill');
    } finally {
      setIsDeleting(false);
    }
  };

  // Progress bar component with 10 blocks
  const ProgressBar = ({ level }: { level: number }) => {
    const filledBlocks = Math.round(level / 10);
    return (
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-6 h-3 rounded-sm',
              i < filledBlocks
                ? 'bg-[var(--accent-primary)]'
                : 'bg-[var(--bg-tertiary)]'
            )}
          />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-[var(--danger)] mb-4">
              Error loading skills
            </div>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Skills Management"
        description="Manage your technical skills and proficiency levels"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => router.push('/admin/skills/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as 'technical' | 'ai')}>
        <Tabs.List className="flex gap-2 mb-6 border-b border-[var(--border-primary)]">
          <Tabs.Trigger
            value="technical"
            className={cn(
              'px-4 h-10 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === 'technical'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            Technical Skills
          </Tabs.Trigger>
          <Tabs.Trigger
            value="ai"
            className={cn(
              'px-4 h-10 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === 'ai'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            AI/ML Skills
          </Tabs.Trigger>
        </Tabs.List>

        {/* Skills List */}
        <Card>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                Loading skills...
              </div>
            ) : currentSkills.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-secondary)] mb-4">
                  No skills found in this category
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/admin/skills/add')}
                >
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-colors"
                  >
                    {/* Skill Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                        {skill.name}
                      </h4>
                      <ProgressBar level={skill.level} />
                    </div>

                    {/* Level Percentage */}
                    <div className="text-sm font-medium text-[var(--text-secondary)] w-12 text-right">
                      {skill.level}%
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
                        aria-label="Edit skill"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(skill)}
                        className="p-2 rounded-md hover:bg-[var(--danger-bg)] transition-colors text-[var(--danger)]"
                        aria-label="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Tabs.Root>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
