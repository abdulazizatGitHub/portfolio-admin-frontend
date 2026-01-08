'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface ProjectFormModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  isLoading?: boolean;
}

const PROJECT_CATEGORIES = [
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'API Service',
  'Machine Learning',
  'DevOps Tool',
  'IoT Application',
  'Web Widget',
  'Browser Extension',
  'Library/Package',
  'Other',
];

export function ProjectFormModal({
  project,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    description: '',
    techStack: [],
    thumbnail: '',
    category: 'Web Application',
    liveUrl: '',
    githubUrl: '',
    startDate: '',
    endDate: '',
    status: 'draft',
    featured: false,
  });

  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        endDate: project.endDate || '',
      });
      setIsCurrentlyWorking(!project.endDate);
    } else {
      // Reset form for new project
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        techStack: [],
        thumbnail: '',
        category: 'Web Application',
        liveUrl: '',
        githubUrl: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'draft',
        featured: false,
      });
      setIsCurrentlyWorking(false);
    }
    setErrors({});
  }, [project, isOpen]);

  const handleChange = (field: keyof Project, value: any) => {
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

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const newTech = techInput.trim();
      if (!formData.techStack?.includes(newTech)) {
        handleChange('techStack', [...(formData.techStack || []), newTech]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    handleChange(
      'techStack',
      formData.techStack?.filter((t) => t !== tech) || []
    );
  };

  const handleCurrentlyWorkingChange = (checked: boolean) => {
    setIsCurrentlyWorking(checked);
    if (checked) {
      handleChange('endDate', null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.shortDescription?.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Full description is required';
    }

    if (!formData.techStack || formData.techStack.length === 0) {
      newErrors.techStack = 'At least one technology is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!isCurrentlyWorking && !formData.endDate) {
      newErrors.endDate = 'End date is required (or check "Currently working")';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const dataToSave = {
      ...formData,
      endDate: isCurrentlyWorking ? null : formData.endDate || null,
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body project-form-content">
            {/* Basic Info Section */}
            <section className="form-section">
              <h3 className="form-section-title">Basic Information</h3>

              <div className="form-field">
                <label htmlFor="title" className="form-label">
                  Project Title <span className="required">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter project title..."
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="shortDescription" className="form-label">
                  Short Description <span className="required">*</span>
                </label>
                <input
                  id="shortDescription"
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  className={`form-input ${errors.shortDescription ? 'error' : ''}`}
                  placeholder="Brief one-line description"
                  maxLength={100}
                />
                {errors.shortDescription && <p className="form-error">{errors.shortDescription}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="description" className="form-label">
                  Full Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Detailed project description..."
                  rows={4}
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>
            </section>

            {/* Media Section */}
            <section className="form-section">
              <h3 className="form-section-title">Thumbnail Image</h3>
              <ImageUpload
                value={formData.thumbnail}
                onChange={(value) => handleChange('thumbnail', value)}
                onRemove={() => handleChange('thumbnail', '')}
              />
            </section>

            {/* Tech Stack Section */}
            <section className="form-section">
              <h3 className="form-section-title">
                Technology Stack <span className="required">*</span>
              </h3>

              <div className="tech-input-wrapper">
                <div className="tech-tags">
                  {formData.techStack?.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="tech-tag-remove"
                        aria-label={`Remove ${tech}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  className="form-input"
                  placeholder="Type technology and press Enter..."
                />
              </div>
              {errors.techStack && <p className="form-error">{errors.techStack}</p>}
            </section>

            {/* Details Section */}
            <section className="form-section">
              <h3 className="form-section-title">Project Details</h3>

              <div className="form-field">
                <label htmlFor="category" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="form-select"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="liveUrl" className="form-label">
                  Live URL
                </label>
                <input
                  id="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleChange('liveUrl', e.target.value)}
                  className="form-input"
                  placeholder="https://..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="githubUrl" className="form-label">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  className="form-input"
                  placeholder="https://github.com/..."
                />
              </div>
            </section>

            {/* Timeline Section */}
            <section className="form-section">
              <h3 className="form-section-title">Timeline</h3>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="startDate" className="form-label">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className={`form-input ${errors.startDate ? 'error' : ''}`}
                  />
                  {errors.startDate && <p className="form-error">{errors.startDate}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="endDate" className="form-label">
                    End Date {!isCurrentlyWorking && <span className="required">*</span>}
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className={`form-input ${errors.endDate ? 'error' : ''}`}
                    disabled={isCurrentlyWorking}
                  />
                  {errors.endDate && <p className="form-error">{errors.endDate}</p>}
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  id="currentlyWorking"
                  type="checkbox"
                  checked={isCurrentlyWorking}
                  onChange={(e) => handleCurrentlyWorkingChange(e.target.checked)}
                  className="checkbox"
                />
                <label htmlFor="currentlyWorking" className="checkbox-label">
                  Currently working on this project
                </label>
              </div>
            </section>

            {/* Options Section */}
            <section className="form-section">
              <h3 className="form-section-title">Options</h3>

              <div className="form-field">
                <label className="form-label">Status</label>
                <div className="radio-group">
                  {(['draft', 'development', 'live', 'archived'] as const).map((status) => (
                    <label key={status} className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="radio"
                      />
                      <span>
                        {status === 'development' ? 'In Development' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="checkbox"
                />
                <label htmlFor="featured" className="checkbox-label">
                  Mark as featured project
                </label>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


