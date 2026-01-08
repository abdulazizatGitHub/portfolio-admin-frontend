'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSkills } from '@/lib/hooks';
import { SkillsForm } from '@/components/sections/Skills/SkillsForm';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { Skill } from '@/types';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading: isFetching } = useSkills();
  const { success, error: showError } = useToast();
  const [skill, setSkill] = useState<Skill | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data && params.id) {
      const foundSkill = data.find((s) => s.id === Number(params.id));
      setSkill(foundSkill);
    }
  }, [data, params.id]);

  const handleSubmit = async (data: Skill) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating skill:', data);
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-gray-600 mb-4">Skill not found</div>
            <button
              onClick={() => router.push('/admin/skills')}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Back to Skills
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Skill"
        description="Update the information for this skill"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills', href: '/admin/skills' },
          { label: 'Edit Skill' },
        ]}
      />

      <Card>
        <div className="p-6">
          <SkillsForm
            initialData={skill}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

