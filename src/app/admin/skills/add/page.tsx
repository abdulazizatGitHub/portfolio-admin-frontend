'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnhancedSkillForm } from '@/components/sections/Skills/EnhancedSkillForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useSkills } from '@/lib/hooks/useSkills';
import type { SkillFormData } from '@/types/skills';

export default function SkillFormPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params?.id as string | undefined;
  const isEditMode = !!skillId;

  const { success, error: showError } = useToast();
  const { data: skills } = useSkills();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkill, setIsLoadingSkill] = useState(isEditMode);
  const [currentSkill, setCurrentSkill] = useState<SkillFormData | null>(null);

  // Get existing skill names for duplicate detection (excluding current skill when editing)
  const existingSkills = skills
    ?.filter(s => isEditMode ? s.id?.toString() !== skillId : true)
    .map(s => s.name) || [];

  // Load skill data when in edit mode
  useEffect(() => {
    if (isEditMode && skills) {
      const skill = skills.find(s => s.id?.toString() === skillId);
      if (skill) {
        setCurrentSkill({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          context: skill.context,
        });
        setIsLoadingSkill(false);
      } else {
        showError('Skill not found');
        router.push('/admin/skills');
      }
    }
  }, [isEditMode, skillId, skills, showError, router]);

  const handleSubmit = async (data: SkillFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditMode) {
        console.log('Updating skill:', skillId, data);
        success('Skill updated successfully');
      } else {
        console.log('Creating skill:', data);
        success('Skill created successfully');
      }

      router.push('/admin/skills');
    } catch (err) {
      showError(`Failed to ${isEditMode ? 'update' : 'create'} skill. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/skills');
  };

  if (isLoadingSkill) {
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
        title={isEditMode ? 'Edit Skill' : 'Add Skill'}
        description={
          isEditMode
            ? 'Update your skill details and proficiency level'
            : 'Define your technical expertise with clarity and confidence'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills', href: '/admin/skills' },
          { label: isEditMode ? 'Edit Skill' : 'Add Skill' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[900px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EnhancedSkillForm
              initialData={currentSkill || undefined}
              existingSkills={existingSkills}
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
