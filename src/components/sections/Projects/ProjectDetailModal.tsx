'use client';

import { X, ExternalLink, Github, Star } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge } from './StatusBadge';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProjectDetailModalProps) {
  if (!isOpen || !project) return null;

  const duration = project.endDate
    ? calculateDuration(project.startDate, project.endDate)
    : 'Ongoing';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Featured Image */}
        {project.thumbnail && (
          <div className="project-detail-image">
            <img src={project.thumbnail} alt={project.title} />
          </div>
        )}

        {/* Content */}
        <div className="modal-body project-detail-content">
          {/* Description */}
          <section className="detail-section">
            <h3 className="section-title">📝 Description</h3>
            <p className="section-content">{project.description}</p>
          </section>

          {/* Tech Stack */}
          <section className="detail-section">
            <h3 className="section-title">🔧 Technology Stack</h3>
            <div className="tech-pills-large">
              {project.techStack.map((tech, index) => (
                <span key={index} className="tech-pill-large">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          {(project.liveUrl || project.githubUrl) && (
            <section className="detail-section">
              <h3 className="section-title">🔗 Links</h3>
              <div className="project-links">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                    <span className="link-url">{project.liveUrl}</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <Github size={16} />
                    <span>GitHub Repository</span>
                    <span className="link-url">{project.githubUrl}</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className="detail-section">
            <h3 className="section-title">📅 Timeline</h3>
            <div className="timeline-info">
              <div className="timeline-item">
                <span className="timeline-label">Started:</span>
                <span className="timeline-value">{formatDate(project.startDate)}</span>
              </div>
              {project.endDate && (
                <div className="timeline-item">
                  <span className="timeline-label">Completed:</span>
                  <span className="timeline-value">{formatDate(project.endDate)}</span>
                </div>
              )}
              <div className="timeline-item">
                <span className="timeline-label">Duration:</span>
                <span className="timeline-value">{duration}</span>
              </div>
            </div>
          </section>

          {/* Metadata */}
          <section className="detail-section">
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">Status:</span>
                <StatusBadge status={project.status} />
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Category:</span>
                <span className="metadata-value">{project.category}</span>
              </div>
              {project.featured && (
                <div className="metadata-item">
                  <Star size={16} fill="var(--warning-500)" stroke="var(--warning-500)" />
                  <span className="metadata-value">Featured Project</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={() => onEdit(project)} className="btn-primary">
            Edit Project
          </button>
          <button onClick={() => onDelete(project)} className="btn-danger">
            Delete
          </button>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (months < 1) return '< 1 month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}


