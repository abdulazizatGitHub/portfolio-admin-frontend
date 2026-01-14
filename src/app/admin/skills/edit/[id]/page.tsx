'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnhancedSkillForm } from '@/components/sections/Skills/EnhancedSkillForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useSkills } from '@/lib/hooks/useSkills';
import type { SkillFormData } from '@/types/skills';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params?.id as string;

  const { success, error: showError } = useToast();
  const { data: skills } = useSkills();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkill, setIsLoadingSkill] = useState(true);
  const [currentSkill, setCurrentSkill] = useState<SkillFormData | null>(null);

  // Get existing skill names for duplicate detection (excluding current skill)
  const existingSkills = skills
    ?.filter(s => s.id?.toString() !== skillId)
    .map(s => s.name) || [];

  // Load skill data
  useEffect(() => {
    if (skills) {
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
  }, [skillId, skills, showError, router]);

  const handleSubmit = async (data: SkillFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating skill:', skillId, data);
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
