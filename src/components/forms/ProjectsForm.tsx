'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, TagInput, Button } from '@/components/ui';
import type { Project } from '@/types';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tech: z.array(z.string().min(1)).min(1, 'At least one technology is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  liveUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  isPublished: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectsFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectsFormProps) {
  const [tech, setTech] = useState<string[]>(initialData?.tech || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      tech: [],
      imagePath: '',
      liveUrl: '',
      sourceUrl: '',
      isPublished: false,
    },
  });

  const isPublished = watch('isPublished');

  const handleTechChange = (tags: string[]) => {
    setTech(tags);
    setValue('tech', tags);
  };

  const onSubmitForm = (data: ProjectFormData) => {
    onSubmit({ ...data, tech });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Project Title"
        required
        placeholder="E-Commerce Platform"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        placeholder="A full-stack e-commerce platform..."
        {...register('description')}
        error={errors.description?.message}
      />

      <TagInput
        label="Technologies"
        tags={tech}
        onChange={handleTechChange}
        placeholder="Add technology and press Enter"
        error={errors.tech?.message}
      />

      <Input
        label="Image Path"
        required
        placeholder="/images/project1.jpg"
        {...register('imagePath')}
        error={errors.imagePath?.message}
      />

      <Input
        label="Live URL"
        placeholder="https://example.com"
        {...register('liveUrl')}
        error={errors.liveUrl?.message}
      />

      <Input
        label="Source URL (GitHub)"
        placeholder="https://github.com/example/project"
        {...register('sourceUrl')}
        error={errors.sourceUrl?.message}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
          Published
        </label>
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

