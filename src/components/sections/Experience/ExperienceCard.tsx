'use client';

import React from 'react';
import { Edit, Trash2, MapPin, Briefcase, Calendar, Clock, ChevronDown } from 'lucide-react';
import {
  getDateRange,
  calculateDuration,
  calculateTotalDuration,
  calculateOverallPeriod,
  isCurrentExperience,
  sortRoles,
} from '@/lib/utils/experienceHelpers';
import type { ExperienceEntry } from '@/types/experience';
import { cn } from '@/lib/utils/cn';

interface ExperienceCardProps {
  entry: ExperienceEntry;
  onEdit: (entry: ExperienceEntry) => void;
  onDelete: (entry: ExperienceEntry) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * ExperienceCard - Timeline card for work experience
 */
export function ExperienceCard({
  entry,
  onEdit,
  onDelete,
  isExpanded = false,
  onToggle,
}: ExperienceCardProps) {
  const isCurrent = isCurrentExperience(entry);
  const overallPeriod = calculateOverallPeriod(entry);
  const totalDuration = calculateTotalDuration(entry);
  const sortedRoles = sortRoles(entry.roles || []);

  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] border rounded-xl overflow-hidden transition-colors',
        isCurrent ? 'border-[var(--primary-500)]' : 'border-[var(--border-subtle)]'
      )}
    >
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              isCurrent
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
            )}
          >
            <Briefcase size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                {entry.organization}
              </h3>
              {isCurrent && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-600 flex-shrink-0">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{overallPeriod}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{totalDuration}</span>
              </div>
              {entry.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{entry.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions + Chevron */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--primary-500)] hover:text-white transition-colors"
            aria-label={`Edit ${entry.organization}`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry);
            }}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label={`Delete ${entry.organization}`}
          >
            <Trash2 size={16} />
          </button>
          <ChevronDown
            size={20}
            className={cn(
              'text-[var(--text-tertiary)] transition-transform ml-2',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* Expandable Content - Roles Timeline */}
      {isExpanded && sortedRoles.length > 0 && (
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          <div className="pt-4">
            <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-4">
              Roles ({sortedRoles.length})
            </h4>

            {/* Mini Timeline for Roles */}
            <div className="relative space-y-4 pl-6">
              {/* Timeline Line */}
              <div className="absolute left-2 top-2 bottom-2 w-px bg-[var(--border-subtle)]" />

              {sortedRoles.map((role) => {
                const dateRange = getDateRange(role.startDate, role.endDate, role.isCurrent);
                const duration = calculateDuration(role.startDate, role.endDate);

                return (
                  <div key={role.id} className="relative">
                    {/* Timeline Node */}
                    <div
                      className={cn(
                        'absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2',
                        role.isCurrent
                          ? 'bg-[var(--primary-500)] border-[var(--primary-500)]'
                          : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                      )}
                    />

                    <div className="p-3 bg-[var(--bg-hover)] rounded-lg">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5
                          className={cn(
                            'font-medium',
                            role.isCurrent
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-secondary)]'
                          )}
                        >
                          {role.jobTitle}
                        </h5>
                        {role.isCurrent && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-600">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                        <span>{dateRange}</span>
                        <span>•</span>
                        <span>{duration}</span>
                      </div>
                      {role.description && (
                        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
