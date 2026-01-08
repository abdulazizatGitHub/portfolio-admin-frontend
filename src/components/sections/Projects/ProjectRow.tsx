'use client';

import { Eye, Pencil, Trash2, FolderOpen, Star } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge } from './StatusBadge';
import { TechPills } from './TechPills';

interface ProjectRowProps {
  project: Project;
  selected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectRow({
  project,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: ProjectRowProps) {
  return (
    <tr className={selected ? 'selected' : ''}>
      {/* Checkbox */}
      <td>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="checkbox"
          aria-label={`Select ${project.title}`}
        />
      </td>

      {/* Thumbnail */}
      <td>
        <div className="project-thumbnail">
          {project.thumbnail ? (
            <img src={project.thumbnail} alt={project.title} />
          ) : (
            <div className="thumbnail-placeholder">
              <FolderOpen size={24} />
            </div>
          )}
        </div>
      </td>

      {/* Title & Description */}
      <td>
        <div className="project-info">
          <div className="project-title-row">
            <span className="project-title">{project.title}</span>
            {project.featured && (
              <Star size={16} fill="var(--warning-500)" stroke="var(--warning-500)" className="featured-badge" />
            )}
          </div>
          <p className="project-description">{project.shortDescription}</p>
        </div>
      </td>

      {/* Tech Stack */}
      <td>
        <TechPills technologies={project.techStack} maxDisplay={3} />
      </td>

      {/* Status */}
      <td>
        <StatusBadge status={project.status} />
      </td>

      {/* Actions */}
      <td>
        <div className="action-buttons">
          <button
            onClick={onView}
            className="action-btn"
            title="View details"
            aria-label={`View ${project.title} details`}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="action-btn"
            title="Edit project"
            aria-label={`Edit ${project.title}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="action-btn action-btn-danger"
            title="Delete project"
            aria-label={`Delete ${project.title}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}


