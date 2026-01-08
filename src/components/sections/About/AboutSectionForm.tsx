'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AboutSection, AboutStat } from '@/types';
import { StatsInput } from '@/components/ui/StatsInput';
import { ChevronLeft, Plus, X } from 'lucide-react';

interface AboutSectionFormProps {
  section?: AboutSection | null;
  onSave: (section: Partial<AboutSection>) => Promise<void>;
  isLoading?: boolean;
}

export function AboutSectionForm({
  section,
  onSave,
  isLoading = false,
}: AboutSectionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<AboutSection>>({
    roleTitle: '',
    paragraphs: [''],
    stats: [],
    orderIndex: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (section) {
      setFormData(section);
    }
  }, [section]);

  const handleChange = (field: keyof AboutSection, value: any) => {
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

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...(formData.paragraphs || [''])];
    newParagraphs[index] = value;
    handleChange('paragraphs', newParagraphs);
  };

  const addParagraph = () => {
    handleChange('paragraphs', [...(formData.paragraphs || ['']), '']);
  };

  const removeParagraph = (index: number) => {
    if ((formData.paragraphs || ['']).length > 1) {
      const newParagraphs = formData.paragraphs?.filter((_, i) => i !== index) || [''];
      handleChange('paragraphs', newParagraphs);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roleTitle?.trim()) {
      newErrors.roleTitle = 'Role/Section title is required';
    }

    if (!formData.paragraphs || formData.paragraphs.length === 0) {
      newErrors.paragraphs = 'At least one paragraph is required';
    } else {
      const hasContent = formData.paragraphs.some((p) => p.trim().length > 0);
      if (!hasContent) {
        newErrors.paragraphs = 'At least one paragraph must have content';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Filter out empty paragraphs
    const cleanedData = {
      ...formData,
      paragraphs: formData.paragraphs?.filter((p) => p.trim().length > 0) || [],
    };

    await onSave(cleanedData);
  };

  const handleCancel = () => {
    router.push('/admin/about');
  };

  return (
    <div className="about-section-form-container">
      {/* Breadcrumb */}
      <button onClick={handleCancel} className="breadcrumb-back">
        <ChevronLeft size={16} />
        Back to Sections
      </button>

      {/* Page Title */}
      <div className="form-page-header">
        <h1 className="form-page-title">
          {section ? 'Edit Resume Section' : 'New Resume Section'}
        </h1>
        <p className="form-page-subtitle">
          {section
            ? 'Update your resume section content'
            : 'Create a section for your resume or about page'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="about-section-form">
        <div className="form-content">
          {/* Role/Section Title */}
          <section className="form-section">
            <h2 className="form-section-title">
              Role/Section Title <span className="required">*</span>
            </h2>
            <div className="form-field">
              <input
                id="roleTitle"
                type="text"
                value={formData.roleTitle}
                onChange={(e) => handleChange('roleTitle', e.target.value)}
                className={`form-input ${errors.roleTitle ? 'error' : ''}`}
                placeholder="Full Stack Developer"
              />
              {errors.roleTitle && <p className="form-error">{errors.roleTitle}</p>}
            </div>
          </section>

          {/* Description Paragraphs */}
          <section className="form-section">
            <h2 className="form-section-title">
              Description Paragraphs <span className="required">*</span>
            </h2>
            <div className="paragraphs-container">
              {formData.paragraphs?.map((paragraph, index) => (
                <div key={index} className="paragraph-item">
                  <div className="paragraph-header">
                    <label className="paragraph-label">Paragraph {index + 1}</label>
                    {formData.paragraphs && formData.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="paragraph-remove-btn"
                      >
                        <X size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    value={paragraph}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    className="form-textarea"
                    placeholder="Write your content here..."
                    rows={4}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addParagraph}
                className="btn-secondary btn-sm"
              >
                <Plus size={16} />
                Add Paragraph
              </button>
            </div>
            {errors.paragraphs && <p className="form-error">{errors.paragraphs}</p>}
          </section>

          {/* Statistics/Key Metrics */}
          <section className="form-section">
            <h2 className="form-section-title">Statistics/Key Metrics</h2>
            <StatsInput
              stats={formData.stats || []}
              onChange={(stats) => handleChange('stats', stats)}
              maxStats={10}
            />
            <p className="form-hint">Add key statistics to highlight your achievements</p>
          </section>

          {/* Display Order */}
          <section className="form-section">
            <h2 className="form-section-title">Display Order</h2>
            <div className="form-field">
              <input
                id="orderIndex"
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) => handleChange('orderIndex', parseInt(e.target.value) || 0)}
                className="form-input"
                style={{ maxWidth: '150px' }}
              />
              <p className="form-hint">
                Position in resume (0 = first, 1 = second, etc.)
              </p>
            </div>
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
            {isLoading ? 'Saving...' : section ? 'Update Section' : 'Create Section'}
          </button>
        </div>
      </form>
    </div>
  );
}


