'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { FormikInput } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { socialLinkSchema } from '@/lib/validations/schemas';
import type { SocialLink } from '@/types';

interface SocialLinkFormProps {
  initialData?: Partial<SocialLink>;
  onSubmit: (data: SocialLink) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SocialLinkForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SocialLinkFormProps) {
  const initialValues: Partial<SocialLink> = {
    platform: initialData?.platform || '',
    url: initialData?.url || '',
  };

  const handleSubmit = async (values: any) => {
    const socialData: SocialLink = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    };
    await onSubmit(socialData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={socialLinkSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <FormikInput
            name="platform"
            label="Platform"
            required
            placeholder="LinkedIn"
            type="text"
          />

          <FormikInput
            name="url"
            label="URL"
            required
            placeholder="https://linkedin.com/in/username"
            type="url"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              {initialData?.id ? 'Update' : 'Create'} Social Link
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}


