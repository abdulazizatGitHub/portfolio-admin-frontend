'use client';

import React, { useState, useRef } from 'react';
import { User, FileText, Save, X, Upload, Trash2, Briefcase, Settings } from 'lucide-react';
import { RolesInput } from './RolesInput';
import { validateProfile } from '@/lib/utils/personalHelpers';
import { Button } from '@/components/ui/Button';
import type { PersonalProfile } from '@/types/personal';
import { cn } from '@/lib/utils/cn';

interface PersonalFormProps {
  initialData?: PersonalProfile;
  onSubmit: (data: PersonalProfile, cvFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * PersonalForm - Form for adding/editing personal profiles
 */
export function PersonalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PersonalFormProps) {
  const isEdit = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PersonalProfile>({
    name: initialData?.name || '',
    titlePrefix: initialData?.titlePrefix || '',
    description: initialData?.description || '',
    roles: initialData?.roles || [],
    cvDownloadName: initialData?.cvDownloadName || 'Resume.pdf',
    cvFileName: initialData?.cvFileName || '',
    cvFile: initialData?.cvFile || '',
    isDefault: initialData?.isDefault || false,
    ...(initialData?.id && { id: initialData.id }),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          cvFile: reader.result as string,
          cvFileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      cvFile: '',
      cvFileName: '',
    });
    setSelectedFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProfile(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData, selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Basic Information</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Your name and greeting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g. John Smith"
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                errors.name
                  ? 'border-red-500'
                  : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
              )}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Greeting <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titlePrefix}
              onChange={(e) => {
                setFormData({ ...formData, titlePrefix: e.target.value });
                if (errors.titlePrefix) setErrors({ ...errors, titlePrefix: '' });
              }}
              placeholder="e.g. Hi, I'm"
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                errors.titlePrefix
                  ? 'border-red-500'
                  : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
              )}
            />
            {errors.titlePrefix && <p className="text-xs text-red-500">{errors.titlePrefix}</p>}
          </div>
        </div>
      </section>

      {/* Professional Roles */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Professional Roles</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Your areas of expertise</p>
          </div>
        </div>

        <RolesInput
          value={formData.roles}
          onChange={(roles) => {
            setFormData({ ...formData, roles });
            if (errors.roles) setErrors({ ...errors, roles: '' });
          }}
          error={errors.roles}
        />
      </section>

      {/* Bio / Description */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Bio</h3>
            <p className="text-sm text-[var(--text-tertiary)]">
              A brief introduction about yourself
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            placeholder="Write a short bio about yourself..."
            rows={6}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors resize-none',
              errors.description
                ? 'border-red-500'
                : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
            )}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>
      </section>

      {/* CV Upload & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CV Upload */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Resume / CV</h3>
              <p className="text-sm text-[var(--text-tertiary)]">Upload your CV file</p>
            </div>
          </div>

          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              formData.cvFile
                ? 'bg-blue-500/5 border-blue-500/30'
                : 'bg-[var(--bg-hover)] border-[var(--border-subtle)] hover:border-[var(--primary-500)]/50'
            )}
          >
            {formData.cvFile ? (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] truncate px-2">
                  {formData.cvFileName}
                </p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] flex items-center justify-center mx-auto">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Click to upload</p>
                <p className="text-xs text-[var(--text-tertiary)]">PDF or DOCX</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </section>

        {/* Profile Settings */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Settings</h3>
              <p className="text-sm text-[var(--text-tertiary)]">Profile preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Download Filename
              </label>
              <input
                type="text"
                value={formData.cvDownloadName}
                onChange={(e) => setFormData({ ...formData, cvDownloadName: e.target.value })}
                placeholder="e.g. John_Smith_Resume.pdf"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
              />
              <p className="text-xs text-[var(--text-tertiary)]">
                The filename when someone downloads your CV
              </p>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-hover)] cursor-pointer hover:border-[var(--primary-500)]/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isDefault}
                disabled={initialData?.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-5 h-5 rounded accent-[var(--primary-500)]"
              />
              <div className="flex-1">
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Set as default profile
                </span>
                <span className="block text-xs text-[var(--text-tertiary)]">
                  Show this profile on your portfolio
                </span>
              </div>
            </label>
          </div>
        </section>
      </div>

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
          {isEdit ? 'Save Changes' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
}
