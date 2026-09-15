'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { TechStackInput } from './TechStackInput';
import { StatusSelector } from './StatusSelector';
import { DecisionsEditor } from './DecisionsEditor';
import { validateUrl } from '@/lib/utils/projectHelpers';
import type { ProjectFormData } from '@/types/projects';
import { cn } from '@/lib/utils/cn';
import { Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';

// Form validation schema
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(200, 'Must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  techStack: z.array(z.string()).min(1, 'Add at least one technology'),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  liveUrl: z
    .string()
    .optional()
    .refine((val) => !val || validateUrl(val) === null, 'Invalid URL'),
  githubUrl: z
    .string()
    .optional()
    .refine((val) => !val || validateUrl(val) === null, 'Invalid URL'),
  status: z.enum(['live', 'draft', 'development', 'archived']),
  featured: z.boolean(),
  isPublished: z.boolean(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  decisions: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

interface EnhancedProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * EnhancedProjectForm - Main project form with sections and validation
 */
export function EnhancedProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EnhancedProjectFormProps) {
  const [ongoing, setOngoing] = useState(!initialData?.endDate);
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      category: initialData?.category || 'web',
      techStack: initialData?.techStack || [],
      thumbnail: initialData?.thumbnail || '',
      liveUrl: initialData?.liveUrl || '',
      githubUrl: initialData?.githubUrl || '',
      status: initialData?.status || 'draft',
      featured: initialData?.featured || false,
      isPublished: initialData?.isPublished || false,
      startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate || null,
      decisions: initialData?.decisions || [],
    },
    mode: 'onChange',
  });

  const shortDescription = watch('shortDescription');
  const featured = watch('featured');
  const isPublished = watch('isPublished');

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit({
      ...data,
      endDate: ongoing ? null : data.endDate,
      // Drop rows the admin added but never filled in — the backend
      // requires both fields non-empty on any entry it receives.
      decisions: data.decisions.filter((d) => d.question.trim() && d.answer.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Basic Information */}
      <section className="card p-6 space-y-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Basic information</h3>

        <div className="grid gap-5">
          <Input
            label="Project Title"
            required
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g. Portfolio Website"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Short Description <span className="text-[var(--danger)]">*</span>
            </label>
            <Textarea
              {...register('shortDescription')}
              rows={2}
              maxLength={200}
              placeholder="A brief one or two sentence summary"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-[var(--text-tertiary)]">
                Shown on the project card preview.
              </p>
              <span
                className={cn(
                  'text-xs',
                  shortDescription.length > 180
                    ? 'text-[var(--warning-600)]'
                    : 'text-[var(--text-tertiary)]'
                )}
              >
                {shortDescription.length} / 200
              </span>
            </div>
            {errors.shortDescription && (
              <p className="text-xs text-[var(--error-500)] mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          <Textarea
            label="Full Description"
            required
            {...register('description')}
            rows={7}
            error={errors.description?.message}
            placeholder="Describe the project, your approach, and the outcome..."
          />

          <Input
            label="Category"
            required
            {...register('category')}
            error={errors.category?.message}
            placeholder="e.g. Web Application"
            className="max-w-sm"
          />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Tech stack</h3>

        <Controller
          name="techStack"
          control={control}
          render={({ field }) => <TechStackInput value={field.value} onChange={field.onChange} />}
        />
        {errors.techStack && (
          <p className="text-sm text-[var(--error-500)]">{errors.techStack.message}</p>
        )}
      </section>

      {/* Decision Log */}
      <section className="card p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Decision log</h3>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            &quot;Why this approach&quot; entries shown on the public site&apos;s Decision Log
            panel. Optional, but featured projects should have at least 3.
          </p>
        </div>

        <Controller
          name="decisions"
          control={control}
          render={({ field }) => <DecisionsEditor value={field.value} onChange={field.onChange} />}
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media */}
        <section className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Media</h3>

          <Input
            label="Thumbnail URL"
            required
            {...register('thumbnail')}
            error={errors.thumbnail?.message}
            placeholder="https://example.com/preview.webp"
          />
          <div className="aspect-video rounded-lg bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
            {watch('thumbnail') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={watch('thumbnail')} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 text-[var(--text-tertiary)]">
                <ImageIcon size={28} className="mx-auto mb-2" />
                <p className="text-xs">No preview available</p>
              </div>
            )}
          </div>
        </section>

        {/* Links */}
        <section className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Links</h3>

          <Input
            label="Live Demo URL"
            {...register('liveUrl')}
            error={errors.liveUrl?.message}
            placeholder="https://example.com"
          />
          <Input
            label="Source Code URL"
            {...register('githubUrl')}
            error={errors.githubUrl?.message}
            placeholder="https://github.com/user/repo"
          />
        </section>
      </div>

      {/* Status & Timeline */}
      <section className="card p-6 space-y-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Status & timeline</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <StatusSelector value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--warning-500)] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-4 h-4 rounded accent-[var(--warning-500)] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--text-primary)]">Featured</div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    Highlight as a flagship project
                  </div>
                </div>
                {featured && <Sparkles size={16} className="text-[var(--warning-500)]" />}
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--success-500)] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="w-4 h-4 rounded accent-[var(--success-500)] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--text-primary)]">Published</div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    Visible on the public site
                  </div>
                </div>
                {isPublished && <CheckCircle2 size={16} className="text-[var(--success-500)]" />}
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Timeline
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                required
                {...register('startDate')}
                error={errors.startDate?.message}
              />

              <div className="space-y-3">
                <Input
                  type="date"
                  label="End Date"
                  {...register('endDate')}
                  disabled={ongoing}
                  error={errors.endDate?.message}
                  className={cn(ongoing && 'opacity-50')}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ongoing}
                    onChange={(e) => setOngoing(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--primary-500)]"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">Ongoing</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          Cancel
        </button>

        <Button type="submit" variant="primary" disabled={isLoading} loading={isLoading}>
          {isEditMode ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
