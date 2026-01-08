'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { FormikField } from '@/components/forms';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { FormSection } from '@/components/ui/FormSection';
import { projectSchema } from '@/lib/validations/schemas';
import type { Project } from '@/types';

interface ProjectsFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Project) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectsFormProps) {
  const initialValues: Partial<Project> = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    tech: initialData?.tech || [],
    imagePath: initialData?.imagePath || '',
    liveUrl: initialData?.liveUrl || '',
    sourceUrl: initialData?.sourceUrl || '',
    isPublished: initialData?.isPublished ?? false,
  };

  const handleSubmit = async (values: any) => {
    const projectData: Project = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    };
    await onSubmit(projectData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={projectSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <FormSection
            title="Project Information"
            description="Enter the basic details of your project"
          >
            <FormikField
              name="title"
              type="text"
              label="Project Title"
              required
              placeholder="e.g., E-Commerce Platform"
            />

            <FormikField
              name="description"
              type="textarea"
              label="Description"
              required
              rows={4}
              placeholder="A full-stack e-commerce platform with payment integration..."
            />

            <FormikField
              name="tech"
              type="tag"
              label="Technologies"
              placeholder="Add technology and press Enter"
            />
          </FormSection>

          <FormSection
            title="Media & Links"
            description="Add project images and external links"
          >
            <FormikField
              name="imagePath"
              type="text"
              label="Image Path"
              required
              placeholder="/images/project1.jpg"
            />

            <FormikField
              name="liveUrl"
              type="url"
              label="Live URL"
              placeholder="https://example.com"
            />

            <FormikField
              name="sourceUrl"
              type="url"
              label="Source URL (GitHub)"
              placeholder="https://github.com/example/project"
            />
          </FormSection>

          <FormSection
            title="Publishing"
            description="Control the visibility of this project"
          >
            <FormField name="isPublished" label="Published Status">
              {(field, meta) => (
                <div className="flex items-center">
                  <input
                    {...field}
                    type="checkbox"
                    id="isPublished"
                    checked={values.isPublished}
                    onChange={(e) => setFieldValue('isPublished', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Publish this project
                  </label>
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
              {initialData?.id ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

