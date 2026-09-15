'use client';

import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { SkillNameInput } from './SkillNameInput';
import { CategorySelector } from './CategorySelector';
import { ProficiencyControl } from './ProficiencyControl';
import { SkillConfidenceIndicator } from './SkillConfidenceIndicator';
import { OptionalContextSection } from './OptionalContextSection';
import { PortfolioPreviewHint } from './PortfolioPreviewHint';
import {
  normalizeSkillName,
  calculateConfidence,
  validateSkillName,
} from '@/lib/utils/skillHelpers';
import type { SkillFormData } from '@/types/skills';

// Enhanced validation schema with custom validations
const enhancedSkillSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name must be 50 characters or less')
    .refine(
      (val) => validateSkillName(val) === null,
      (val) => ({ message: validateSkillName(val) || 'Invalid skill name' })
    )
    .transform(normalizeSkillName),
  category: z.enum(
    ['frontend', 'backend', 'database', 'devops', 'tools', 'soft', 'technical', 'ai'],
    {
      errorMap: () => ({ message: 'Please select a category' }),
    }
  ),
  level: z.number().min(0).max(100),
  context: z.string().max(200, 'Context must be 200 characters or less').optional(),
});

type EnhancedSkillFormData = z.infer<typeof enhancedSkillSchema>;

interface EnhancedSkillFormProps {
  initialData?: Partial<SkillFormData>;
  existingSkills?: string[];
  onSubmit: (data: SkillFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * EnhancedSkillForm - Main form component orchestrating all enhanced skill input components
 * Provides intelligent skill entry with semantic proficiency levels and confidence indicators
 */
export function EnhancedSkillForm({
  initialData,
  existingSkills = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: EnhancedSkillFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EnhancedSkillFormData>({
    resolver: zodResolver(enhancedSkillSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'frontend',
      level: initialData?.level || 50,
      context: initialData?.context || '',
    },
  });

  // Watch form values for derived state
  const name = watch('name');
  const category = watch('category');
  const level = watch('level');
  const context = watch('context');

  // Calculate confidence level based on proficiency and context
  const confidence = useMemo(() => {
    return calculateConfidence(level, !!context && context.length > 10);
  }, [level, context]);

  // Handle form submission
  const onSubmitForm = (data: EnhancedSkillFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="space-y-6">
        {/* Skill Identity Section */}
        <div className="card p-6 space-y-6">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <SkillNameInput
                value={field.value}
                onChange={field.onChange}
                existingSkills={existingSkills}
                error={errors.name?.message}
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CategorySelector
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>

        {/* Proficiency Section */}
        <div className="card p-6 space-y-6">
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <ProficiencyControl
                value={field.value}
                onChange={field.onChange}
                error={errors.level?.message}
                disabled={isLoading}
              />
            )}
          />

          <div className="pt-2">
            <SkillConfidenceIndicator confidence={confidence} />
          </div>
        </div>

        {/* Contextual Intelligence */}
        <div className="card p-6 space-y-4">
          <Controller
            name="context"
            control={control}
            render={({ field }) => (
              <OptionalContextSection
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
        </div>

        {/* Visualization Preview */}
        <div className="card p-6 border-dashed">
          <PortfolioPreviewHint skillName={name} category={category} level={level} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Cancel
          </button>

          <Button type="submit" disabled={!isValid || isLoading} loading={isLoading}>
            {initialData?.name ? 'Save Changes' : 'Add Skill'}
          </Button>
        </div>
      </div>
    </form>
  );
}
