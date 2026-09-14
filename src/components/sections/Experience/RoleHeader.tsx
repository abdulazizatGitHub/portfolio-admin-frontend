'use client';

import React from 'react';
import { ChevronDown, Calendar, Briefcase } from 'lucide-react';
import { ExperienceRole } from '@/types';
import { cn } from '@/lib/utils/cn';

interface RoleHeaderProps {
  role: ExperienceRole;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RoleHeader({ role, isExpanded, onToggle }: RoleHeaderProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getDateRange = () => {
    if (!role.startDate) return 'Select dates';
    const start = formatDate(role.startDate);
    const end = role.isCurrent || !role.endDate ? 'Present' : formatDate(role.endDate);
    return `${start} – ${end}`;
  };

  const displayTitle = role.jobTitle || 'New Role';
  const dateRange = getDateRange();

  return (
    <button
      type="button"
      className="w-full text-left p-5 outline-none group"
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              isExpanded
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
            )}
          >
            <Briefcase size={20} />
          </div>

          <div className="space-y-1">
            <h4
              className={cn(
                'text-base font-semibold transition-colors',
                isExpanded ? 'text-[var(--primary-500)]' : 'text-[var(--text-primary)]'
              )}
            >
              {displayTitle}
            </h4>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)]">
              <Calendar size={12} />
              <span>{dateRange}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role.isCurrent && !isExpanded && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Current
              </span>
            </div>
          )}

          <div
            className={cn(
              'p-1.5 rounded-md transition-all',
              isExpanded
                ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)] rotate-180'
                : 'text-[var(--text-tertiary)]'
            )}
          >
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </button>
  );
}
