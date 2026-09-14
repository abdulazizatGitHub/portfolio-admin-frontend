'use client';

import React from 'react';
import { LayoutGrid, CheckCircle2, FileText, Code, Archive, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProjectStatus } from '@/types/projects';

interface StatusFilterConfig {
  value: ProjectStatus | 'all';
  label: string;
  icon: LucideIcon;
}

const statusFilters: StatusFilterConfig[] = [
  { value: 'all', label: 'All', icon: LayoutGrid },
  { value: 'live', label: 'Live', icon: CheckCircle2 },
  { value: 'draft', label: 'Draft', icon: FileText },
  { value: 'development', label: 'Development', icon: Code },
  { value: 'archived', label: 'Archived', icon: Archive },
];

interface ProjectStatusFilterProps {
  activeStatus: ProjectStatus | 'all';
  onChange: (status: ProjectStatus | 'all') => void;
  counts: Record<ProjectStatus | 'all', number>;
}

/**
 * ProjectStatusFilter - Filter buttons for project status (wrapping)
 */
export function ProjectStatusFilter({ activeStatus, onChange, counts }: ProjectStatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {statusFilters.map((filter) => {
        const Icon = filter.icon;
        const count = counts[filter.value] || 0;
        const isActive = activeStatus === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
              isActive
                ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                isActive
                  ? 'bg-[var(--primary-500)] text-white'
                  : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
