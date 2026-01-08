'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { FormikInput, FormikSelect } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { contactInfoSchema } from '@/lib/validations/schemas';
import type { ContactInfoItem } from '@/types';

interface ContactInfoFormProps {
  initialData?: Partial<ContactInfoItem>;
  onSubmit: (data: ContactInfoItem) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactInfoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ContactInfoFormProps) {
  const initialValues: Partial<ContactInfoItem> = {
    type: initialData?.type || 'email',
    label: initialData?.label || '',
    value: initialData?.value || '',
    href: initialData?.href || '',
  };

  const handleSubmit = async (values: any) => {
    const contactData: ContactInfoItem = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    };
    await onSubmit(contactData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={contactInfoSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <FormikSelect
            name="type"
            label="Type"
            required
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'location', label: 'Location' },
            ]}
          />

          <FormikInput
            name="label"
            label="Label"
            required
            placeholder="Email"
            type="text"
          />

          <FormikInput
            name="value"
            label="Value"
            required
            placeholder="john.doe@example.com"
            type="text"
          />

          <FormikInput
            name="href"
            label="Link (optional)"
            placeholder="mailto:john.doe@example.com"
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
              {initialData?.id ? 'Update' : 'Create'} Contact Info
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}


