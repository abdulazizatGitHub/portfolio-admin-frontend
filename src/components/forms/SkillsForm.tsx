'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button } from '@/components/ui';
import type { Skill } from '@/types';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.number().min(0).max(100),
  category: z.enum(['technical', 'ai']),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillsFormProps {
  initialData?: Partial<Skill>;
  onSubmit: (data: SkillFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SkillsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SkillsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData || {
      name: '',
      level: 50,
      category: 'technical',
    },
  });

  const level = watch('level');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Skill Name"
        required
        placeholder="JavaScript"
        {...register('name')}
        error={errors.name?.message}
      />

      <Select
        label="Category"
        required
        options={[
          { value: 'technical', label: 'Technical' },
          { value: 'ai', label: 'AI/ML' },
        ]}
        {...register('category')}
        error={errors.category?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level: {level}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          {...register('level', { valueAsNumber: true })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        {errors.level && (
          <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {initialData?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

