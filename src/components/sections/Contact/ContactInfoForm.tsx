'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Link as LinkIcon, Save, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contactInfoSchema } from '@/lib/validations/schemas';
import type { ContactInfoItem } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ContactInfoFormValues {
  type: 'email' | 'phone' | 'location';
  label: string;
  value: string;
  href?: string;
}

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      type: initialData?.type || 'email',
      label: initialData?.label || '',
      value: initialData?.value || '',
      href: initialData?.href || '',
    },
  });

  const type = watch('type');
  const label = watch('label');
  const value = watch('value');

  const handleFormSubmit = async (values: ContactInfoFormValues) => {
    const contactData: ContactInfoItem = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    } as ContactInfoItem;
    await onSubmit(contactData);
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'email':
        return <Mail size={20} />;
      case 'phone':
        return <Phone size={20} />;
      case 'location':
        return <MapPin size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-2xl mx-auto space-y-6 pb-10">
      <section className="card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
            {getTypeIcon(type)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Contact Information
            </h3>
            <p className="text-xs text-[var(--text-tertiary)]">Update your contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Contact Type</label>
            <select
              {...register('type')}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
            >
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
              <option value="location">Location / Address</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Label <span className="text-[var(--error-500)]">*</span>
              </label>
              <input
                type="text"
                {...register('label')}
                placeholder="e.g., Primary Email"
                className={cn(
                  'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                  errors.label
                    ? 'border-[var(--error-500)]'
                    : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                )}
              />
              {errors.label && (
                <p className="text-xs text-[var(--error-500)]">{errors.label.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Contact Value <span className="text-[var(--error-500)]">*</span>
              </label>
              <input
                type="text"
                {...register('value')}
                placeholder="e.g., contact@dev.com"
                className={cn(
                  'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                  errors.value
                    ? 'border-[var(--error-500)]'
                    : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                )}
              />
              {errors.value && (
                <p className="text-xs text-[var(--error-500)]">{errors.value.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Action Link</label>
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                {...register('href')}
                placeholder="e.g., mailto:contact@dev.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
              />
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Optional URL for direct interaction (e.g., mailto:someone@example.com)
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
        >
          <X size={16} />
          Cancel
        </button>
        <Button
          type="submit"
          loading={isSubmitting || isLoading}
          disabled={!label || !value}
          className="flex items-center gap-2"
        >
          {!isSubmitting && !isLoading && <Save size={16} />}
          {initialData?.id ? 'Update Contact Info' : 'Save Contact Info'}
        </Button>
      </div>
    </form>
  );
}
