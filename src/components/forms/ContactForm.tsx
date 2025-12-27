'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button } from '@/components/ui';
import type { ContactInfoItem, SocialLink } from '@/types';

const contactInfoSchema = z.object({
  type: z.enum(['email', 'phone', 'location']),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  href: z.string().optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
});

type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

interface ContactInfoFormProps {
  initialData?: Partial<ContactInfoItem>;
  onSubmit: (data: ContactInfoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface SocialLinkFormProps {
  initialData?: Partial<SocialLink>;
  onSubmit: (data: SocialLinkFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactInfoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ContactInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData || {
      type: 'email',
      label: '',
      value: '',
      href: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Type"
        required
        options={[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'location', label: 'Location' },
        ]}
        {...register('type')}
        error={errors.type?.message}
      />

      <Input
        label="Label"
        required
        placeholder="Email"
        {...register('label')}
        error={errors.label?.message}
      />

      <Input
        label="Value"
        required
        placeholder="john.doe@example.com"
        {...register('value')}
        error={errors.value?.message}
      />

      <Input
        label="Link (optional)"
        placeholder="mailto:john.doe@example.com"
        {...register('href')}
        error={errors.href?.message}
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

export function SocialLinkForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SocialLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: initialData || {
      platform: '',
      url: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Platform"
        required
        placeholder="LinkedIn"
        {...register('platform')}
        error={errors.platform?.message}
      />

      <Input
        label="URL"
        required
        type="url"
        placeholder="https://linkedin.com/in/username"
        {...register('url')}
        error={errors.url?.message}
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

