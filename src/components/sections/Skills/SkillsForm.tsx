'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { FormikField } from '@/components/forms';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { FormSection } from '@/components/ui/FormSection';
import { skillSchema } from '@/lib/validations/schemas';
import type { Skill } from '@/types';

interface SkillsFormProps {
  initialData?: Partial<Skill>;
  onSubmit: (data: Skill) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SkillsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SkillsFormProps) {
  const initialValues: Partial<Skill> = {
    name: initialData?.name || '',
    level: initialData?.level ?? 50,
    category: initialData?.category || 'technical',
  };

  const handleSubmit = async (values: any) => {
    const skillData: Skill = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    };
    await onSubmit(skillData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={skillSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <FormSection
            title="Skill Details"
            description="Enter the details of your skill"
          >
            <FormikField
              name="name"
              type="text"
              label="Skill Name"
              required
              placeholder="e.g., JavaScript"
            />

            <FormikField
              name="category"
              type="select"
              label="Category"
              required
              options={[
                { value: 'technical', label: 'Technical' },
                { value: 'ai', label: 'AI/ML' },
              ]}
            />

            <FormField name="level" label="Proficiency Level" required>
              {(field, meta) => (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Level: {values.level}%
                    </span>
                  </div>
                  <input
                    {...field}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={values.level}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setFieldValue('level', value);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  {meta.touched && meta.error && (
                    <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                  )}
                </div>
              )}
            </FormField>
          </FormSection>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || isLoading}
              className="cursor-pointer"
            >
              {initialData?.id ? 'Update' : 'Create'} Skill
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

