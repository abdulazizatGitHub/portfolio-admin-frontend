'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnhancedSkillForm } from '@/components/sections/Skills/EnhancedSkillForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useSkills, useUpdateSkill } from '@/lib/hooks';
import type { SkillFormData } from '@/types/skills';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params?.id as string;

  const { success, error: showError } = useToast();
  const { data: skills, isLoading: isLoadingSkill } = useSkills();
  const updateSkill = useUpdateSkill();
  const [isLoading, setIsLoading] = useState(false);

  const skill = skills?.find((s) => s.id === skillId);
  const existingSkills = skills?.filter((s) => s.id !== skillId).map((s) => s.name) || [];

  const handleSubmit = async (data: SkillFormData) => {
    setIsLoading(true);
    try {
      await updateSkill.mutateAsync({ id: skillId, data });
      success('Skill updated successfully');
      router.push('/admin/skills');
    } catch (err) {
      showError('Failed to update skill. Please try again.');
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

  if (!skill) {
    showError('Skill not found');
    router.push('/admin/skills');
    return null;
  }

  const initialData: SkillFormData = {
    name: skill.name,
    category: skill.category,
    level: skill.level,
    context: skill.context,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Edit Skill"
        description="Update your skill details and proficiency level"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills', href: '/admin/skills' },
          { label: 'Edit Skill' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[900px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EnhancedSkillForm
              initialData={initialData}
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
