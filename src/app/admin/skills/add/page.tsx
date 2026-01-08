'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SkillsForm } from '@/components/sections/Skills/SkillsForm';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/lib/hooks/useToast';
import type { Skill } from '@/types';

export default function AddSkillPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Skill) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating skill:', data);
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
    <>
      <PageHeader
        title="Add Skill"
        description="Add a new skill to showcase your technical expertise"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Skills', href: '/admin/skills' },
          { label: 'Add Skill' },
        ]}
      />

      <Card>
        <div className="p-6">
          <SkillsForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}

