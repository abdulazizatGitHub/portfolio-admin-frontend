'use client';

import React from 'react';
import { Edit, Trash2, User, BarChart3, ChevronDown } from 'lucide-react';
import type { AboutSection } from '@/types/about';
import { cn } from '@/lib/utils/cn';

interface AboutCardProps {
  section: AboutSection;
  onEdit: (section: AboutSection) => void;
  onDelete: (section: AboutSection) => void;
  isPrimary?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * AboutCard - Expandable card for displaying bio sections
 */
export function AboutCard({
  section,
  onEdit,
  onDelete,
  isPrimary = false,
  isExpanded = false,
  onToggle,
}: AboutCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] border rounded-xl overflow-hidden transition-colors',
        isPrimary ? 'border-[var(--primary-500)]' : 'border-[var(--border-subtle)]'
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
              isPrimary
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
            )}
          >
            <User size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                {section.roleTitle}
              </h3>
              {isPrimary && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--primary-500)]/10 text-[var(--primary-500)] flex-shrink-0">
                  Main
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">
              Section {section.orderIndex}
            </span>
          </div>
        </div>

        {/* Actions + Chevron */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(section);
            }}
            className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--primary-500)] hover:text-white transition-colors"
            aria-label={`Edit ${section.roleTitle}`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(section);
            }}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label={`Delete ${section.roleTitle}`}
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
          {/* Bio Content */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
              Bio
            </h4>
            <div className="space-y-2">
              {section.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-sm text-[var(--text-secondary)] leading-relaxed p-3 bg-[var(--bg-hover)] rounded-lg"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Stats */}
          {section.stats && section.stats.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={14} className="text-[var(--text-tertiary)]" />
                <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
                  Stats
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {section.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 bg-[var(--bg-hover)] rounded-lg text-center">
                    <span className="block text-lg font-bold text-[var(--text-primary)]">
                      {stat.value}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">{stat.label}</span>
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
