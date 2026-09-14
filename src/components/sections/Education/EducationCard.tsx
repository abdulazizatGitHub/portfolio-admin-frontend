'use client';

import React from 'react';
import { Edit, Trash2, GraduationCap, Calendar, ChevronDown, Award } from 'lucide-react';
import {
  getEducationIcon,
  parseEducationTitle,
  isCurrentEducation,
  parseAchievements,
} from '@/lib/utils/educationHelpers';
import type { EducationEntry } from '@/types/education';
import { cn } from '@/lib/utils/cn';

interface EducationCardProps {
  entry: EducationEntry;
  onEdit: (entry: EducationEntry) => void;
  onDelete: (entry: EducationEntry) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * EducationCard - Expandable card for education entries
 */
export function EducationCard({
  entry,
  onEdit,
  onDelete,
  isExpanded = false,
  onToggle,
}: EducationCardProps) {
  const isCurrent = isCurrentEducation(entry);
  const { degree, institution } = parseEducationTitle(entry.title);
  const Icon = getEducationIcon(degree);
  const achievements = parseAchievements(entry.description);

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
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                {institution || degree || entry.title}
              </h3>
              {isCurrent && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-600 flex-shrink-0">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <Calendar size={12} />
              <span>{entry.period}</span>
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
            aria-label={`Edit ${entry.title}`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry);
            }}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label={`Delete ${entry.title}`}
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

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          {/* Degree */}
          {institution && degree && (
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Award size={16} className="text-[var(--primary-500)]" />
                <span className="font-medium">{degree}</span>
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="pt-3">
              <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
                Achievements
              </h4>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[var(--bg-hover)] rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-500)] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
