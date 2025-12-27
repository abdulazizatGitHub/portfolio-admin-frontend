'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';
import type { EducationEntry } from '@/types';

const educationSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  initialData?: Partial<EducationEntry>;
  onSubmit: (data: EducationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EducationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
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
        placeholder="2018 - 2022"
        {...register('period')}
        error={errors.period?.message}
      />

      <Input
        label="Title"
        required
        placeholder="Bachelor of Science in Computer Science"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        placeholder="Graduated with honors..."
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

