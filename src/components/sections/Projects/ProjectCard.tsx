'use client';

import React from 'react';
import { Edit, Trash2, ExternalLink, Github, Star, Calendar } from 'lucide-react';
import {
  getStatusInfo,
  getProjectDuration,
  getPlaceholderThumbnail,
} from '@/lib/utils/projectHelpers';
import type { Project } from '@/types/projects';
import { cn } from '@/lib/utils/cn';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
}

/**
 * ProjectCard - Clean card for displaying project with thumbnail
 */
export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const statusInfo = getStatusInfo(project.status);
  const duration = getProjectDuration(project.startDate, project.endDate);
  const thumbnail = project.thumbnail || getPlaceholderThumbnail(project.title);

  // Show max 4 tech stack items
  const visibleTech = project.techStack.slice(0, 4);
  const remainingTech = project.techStack.length - 4;

  return (
    <div
      className="group bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--primary-500)]/30 transition-colors cursor-pointer"
      onClick={() => onView(project)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[var(--bg-hover)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- thumbnails are arbitrary
                    admin-entered URLs (any host), which next/image's remote-pattern allowlist can't cover */}
        <img
          src={thumbnail}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500 text-white text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className="px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
            }}
          >
            {statusInfo.label}
          </div>
        </div>

        {/* Quick Links - Visible on Hover */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-white/90 text-[var(--primary-500)] hover:bg-white transition-colors"
              title="Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header: Title + Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
              {project.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
              <Calendar className="w-3 h-3" />
              {duration}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs text-[var(--text-secondary)] bg-[var(--bg-hover)] border border-[var(--border-subtle)]"
              >
                {tech}
              </span>
            ))}
            {remainingTech > 0 && (
              <span className="px-2 py-0.5 rounded text-xs text-[var(--primary-500)] bg-[var(--primary-500)]/10">
                +{remainingTech}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
