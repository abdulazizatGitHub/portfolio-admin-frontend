'use client';

import React, { useState } from 'react';
import { User, FileText, BarChart3, Save, X } from 'lucide-react';
import { ParagraphsInput } from './ParagraphsInput';
import { StatsInput } from './StatsInput';
import { AboutStatsDisplay } from './AboutStatsDisplay';
import { getRoleIcon, getRoleColor } from '@/lib/utils/aboutHelpers';
import { Button } from '@/components/ui/Button';
import type { AboutSection } from '@/types/about';
import { cn } from '@/lib/utils/cn';

interface AboutFormProps {
  initialData?: AboutSection;
  onSubmit: (data: AboutSection) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * AboutForm - Form for adding/editing about sections
 */
export function AboutForm({ initialData, onSubmit, onCancel, isLoading = false }: AboutFormProps) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<AboutSection>({
    roleTitle: initialData?.roleTitle || '',
    paragraphs: initialData?.paragraphs || [''],
    stats: initialData?.stats || [{ label: '', value: '' }],
    orderIndex: initialData?.orderIndex || 0,
    ...(initialData?.id && { id: initialData.id }),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.roleTitle.trim()) {
      newErrors.roleTitle = 'Role title is required';
    }

    const validParagraphs = formData.paragraphs.filter((p) => p.trim());
    if (validParagraphs.length === 0) {
      newErrors.paragraphs = 'At least one paragraph is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanedData: AboutSection = {
      ...formData,
      paragraphs: formData.paragraphs.filter((p) => p.trim()),
      stats: formData.stats.filter((s) => s.label.trim() && s.value.trim()),
    };

    onSubmit(cleanedData);
  };

  const Icon = getRoleIcon(formData.roleTitle || 'default');
  const color = getRoleColor(formData.roleTitle || 'default');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Title Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Role Title</h3>
            <p className="text-sm text-[var(--text-tertiary)]">
              Your professional role or expertise area
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          {/* Role Icon Preview */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => {
                setFormData({ ...formData, roleTitle: e.target.value });
                if (errors.roleTitle) setErrors({ ...errors, roleTitle: '' });
              }}
              placeholder="e.g. Full Stack Developer"
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                errors.roleTitle
                  ? 'border-red-500'
                  : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
              )}
            />
            {errors.roleTitle && <p className="text-xs text-red-500">{errors.roleTitle}</p>}
            <p className="text-xs text-[var(--text-tertiary)]">
              The icon is automatically selected based on your role title
            </p>
          </div>
        </div>
      </section>

      {/* Bio Content Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Bio Content</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Write paragraphs about this role</p>
          </div>
        </div>

        <ParagraphsInput
          value={formData.paragraphs}
          onChange={(paragraphs) => {
            setFormData({ ...formData, paragraphs });
            if (errors.paragraphs) setErrors({ ...errors, paragraphs: '' });
          }}
          error={errors.paragraphs}
        />
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Key Stats</h3>
            <p className="text-sm text-[var(--text-tertiary)]">
              Highlight achievements with numbers
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <StatsInput
            value={formData.stats}
            onChange={(stats) => setFormData({ ...formData, stats })}
            error={errors.stats}
          />

          {/* Stats Preview */}
          {formData.stats.some((s) => s.label && s.value) && (
            <div className="mt-4 p-4 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
              <p className="text-xs font-medium text-[var(--text-tertiary)] mb-3">Preview</p>
              <AboutStatsDisplay
                stats={formData.stats.filter((s) => s.label.trim() && s.value.trim())}
              />
            </div>
          )}
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          <X size={16} />
          Cancel
        </button>

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="px-6 py-2.5 flex items-center gap-2"
        >
          {!isLoading && <Save size={16} />}
          {isEdit ? 'Save Changes' : 'Create Section'}
        </Button>
      </div>
    </form>
  );
}
