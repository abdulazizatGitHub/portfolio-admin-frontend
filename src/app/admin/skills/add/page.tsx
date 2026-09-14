'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedSkillForm } from '@/components/sections/Skills/EnhancedSkillForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import { useSkills, useCreateSkill } from '@/lib/hooks';
import type { SkillFormData } from '@/types/skills';

export default function SkillFormPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { data: skills } = useSkills();
  const createSkill = useCreateSkill();
  const [isLoading, setIsLoading] = useState(false);

  const existingSkills = skills?.map((s) => s.name) || [];

  const handleSubmit = async (data: SkillFormData) => {
    setIsLoading(true);
    try {
      await createSkill.mutateAsync(data);
      success('Skill created successfully');
      router.push('/admin/skills');
    } catch (err) {
      showError('Failed to create skill. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/skills');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Add Skill"
        description="Define your technical expertise with clarity and confidence"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills', href: '/admin/skills' },
          { label: 'Add Skill' },
        ]}
      />

      {/* Centered Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-[900px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
            <EnhancedSkillForm
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
