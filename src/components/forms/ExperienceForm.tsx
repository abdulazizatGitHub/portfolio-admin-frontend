'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';
import type { ExperienceEntry } from '@/types';

const experienceSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: Partial<ExperienceEntry>;
  onSubmit: (data: ExperienceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      period: '',
      title: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Period"
        required
        placeholder="2022 - Present"
        {...register('period')}
        error={errors.period?.message}
      />

      <Input
        label="Title"
        required
        placeholder="Senior Full Stack Developer"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        placeholder="Leading development of multiple web applications..."
        {...register('description')}
        error={errors.description?.message}
      />

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

