'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Share2,
  Globe,
  Link as LinkIcon,
  Save,
  X,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { socialLinkSchema } from '@/lib/validations/schemas';
import type { SocialLink } from '@/types';
import { cn } from '@/lib/utils/cn';

interface SocialLinkFormValues {
  platform: string;
  url: string;
}

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: initialData?.platform || '',
      url: initialData?.url || '',
    },
  });

  const platform = watch('platform');
  const url = watch('url');

  const handleFormSubmit = async (values: SocialLinkFormValues) => {
    const socialData: SocialLink = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    } as SocialLink;
    await onSubmit(socialData);
  };

  const getPlatformIcon = (p: string) => {
    const lower = p.toLowerCase();
    if (lower.includes('github')) return <Github size={20} />;
    if (lower.includes('linkedin')) return <Linkedin size={20} />;
    if (lower.includes('twitter') || lower.includes('x')) return <Twitter size={20} />;
    if (lower.includes('youtube')) return <Youtube size={20} />;
    if (lower.includes('instagram')) return <Instagram size={20} />;
    if (lower.includes('facebook')) return <Facebook size={20} />;
    return <Globe size={20} />;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-2xl mx-auto space-y-6 pb-10">
      <section className="card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--info-500)]/10 text-[var(--info-500)]">
            {getPlatformIcon(platform)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Social Media Link
            </h3>
            <p className="text-xs text-[var(--text-tertiary)]">Update your social media link</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Platform Name <span className="text-[var(--error-500)]">*</span>
            </label>
            <div className="relative">
              <Share2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                {...register('platform')}
                placeholder="e.g., GitHub, LinkedIn, BlueSky"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                  errors.platform
                    ? 'border-[var(--error-500)]'
                    : 'border-[var(--border-subtle)] focus:border-[var(--info-500)]'
                )}
              />
            </div>
            {errors.platform && (
              <p className="text-xs text-[var(--error-500)]">{errors.platform.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Social Link URL <span className="text-[var(--error-500)]">*</span>
            </label>
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="url"
                {...register('url')}
                placeholder="https://..."
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                  errors.url
                    ? 'border-[var(--error-500)]'
                    : 'border-[var(--border-subtle)] focus:border-[var(--info-500)]'
                )}
              />
            </div>
            {errors.url && <p className="text-xs text-[var(--error-500)]">{errors.url.message}</p>}
            <p className="text-xs text-[var(--text-tertiary)]">URL to your social profile.</p>
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
          disabled={!platform || !url}
          className="flex items-center gap-2"
        >
          {!isSubmitting && !isLoading && <Save size={16} />}
          {initialData?.id ? 'Update Social Link' : 'Save Social Link'}
        </Button>
      </div>
    </form>
  );
}
