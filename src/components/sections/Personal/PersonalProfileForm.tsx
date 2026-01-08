'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PersonalProfile } from '@/types';
import { RolesInput } from '@/components/ui/RolesInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { ChevronLeft } from 'lucide-react';

interface PersonalProfileFormProps {
  profile?: PersonalProfile | null;
  onSave: (profile: Partial<PersonalProfile>) => Promise<void>;
  isLoading?: boolean;
}

export function PersonalProfileForm({
  profile,
  onSave,
  isLoading = false,
}: PersonalProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<PersonalProfile>>({
    name: '',
    titlePrefix: '',
    description: '',
    roles: [],
    cvFile: '',
    cvFileName: '',
    cvDownloadName: '',
    isDefault: false,
  });

  const [currentFile, setCurrentFile] = useState<{ name: string; size: number } | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      if (profile.cvFileName) {
        setCurrentFile({ name: profile.cvFileName, size: 0 });
      }
    }
  }, [profile]);

  const handleChange = (field: keyof PersonalProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        cvFile: base64,
        cvFileName: file.name,
        cvDownloadName: prev.cvDownloadName || file.name,
      }));
      setCurrentFile({ name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({
      ...prev,
      cvFile: '',
      cvFileName: '',
    }));
    setCurrentFile(undefined);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.titlePrefix?.trim()) {
      newErrors.titlePrefix = 'Title prefix is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'At least one role is required';
    }

    if (!formData.cvDownloadName?.trim()) {
      newErrors.cvDownloadName = 'CV download filename is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSave(formData);
  };

  const handleCancel = () => {
    router.push('/admin/personal');
  };

  return (
    <div className="personal-profile-form-container">
      {/* Breadcrumb */}
      <button onClick={handleCancel} className="breadcrumb-back">
        <ChevronLeft size={16} />
        Back to Profiles
      </button>

      {/* Page Title */}
      <div className="form-page-header">
        <h1 className="form-page-title">
          {profile ? 'Edit Personal Profile' : 'New Personal Profile'}
        </h1>
        <p className="form-page-subtitle">
          {profile
            ? 'Update your profile information'
            : 'Create a new profile for different contexts'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="personal-profile-form">
        <div className="form-content">
          {/* Basic Information */}
          <section className="form-section">
            <h2 className="form-section-title">Basic Information</h2>

            <div className="form-field">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="titlePrefix" className="form-label">
                Title Prefix <span className="required">*</span>
              </label>
              <input
                id="titlePrefix"
                type="text"
                value={formData.titlePrefix}
                onChange={(e) => handleChange('titlePrefix', e.target.value)}
                className={`form-input ${errors.titlePrefix ? 'error' : ''}`}
                placeholder="Hi, I'm"
              />
              {errors.titlePrefix && <p className="form-error">{errors.titlePrefix}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="description" className="form-label">
                Professional Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="A passionate full-stack developer..."
                rows={4}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>
          </section>

          {/* Roles */}
          <section className="form-section">
            <h2 className="form-section-title">
              Professional Roles <span className="required">*</span>
            </h2>
            <RolesInput
              roles={formData.roles || []}
              onChange={(roles) => handleChange('roles', roles)}
              maxRoles={10}
            />
            {errors.roles && <p className="form-error">{errors.roles}</p>}
          </section>

          {/* CV Upload */}
          <section className="form-section">
            <h2 className="form-section-title">CV/Resume Upload</h2>
            <FileUpload
              accept=".pdf,application/pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              currentFile={currentFile}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              label="Drop PDF here or click to browse"
            />
          </section>

          {/* CV Download Name */}
          <section className="form-section">
            <h2 className="form-section-title">CV Download Filename</h2>
            <div className="form-field">
              <label htmlFor="cvDownloadName" className="form-label">
                Filename <span className="required">*</span>
              </label>
              <input
                id="cvDownloadName"
                type="text"
                value={formData.cvDownloadName}
                onChange={(e) => handleChange('cvDownloadName', e.target.value)}
                className={`form-input ${errors.cvDownloadName ? 'error' : ''}`}
                placeholder="John_Doe_Resume.pdf"
              />
              <p className="form-hint">
                This is the filename that will be used when someone downloads your CV
              </p>
              {errors.cvDownloadName && <p className="form-error">{errors.cvDownloadName}</p>}
            </div>
          </section>

          {/* Options */}
          <section className="form-section">
            <h2 className="form-section-title">Options</h2>
            <div className="form-checkbox">
              <input
                id="isDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => handleChange('isDefault', e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="isDefault" className="checkbox-label">
                Set as default profile
              </label>
            </div>
            <p className="form-hint">
              The default profile will be shown on your main portfolio page
            </p>
          </section>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}


