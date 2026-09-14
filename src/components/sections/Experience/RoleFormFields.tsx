'use client';

import React, { useState, useEffect, useId } from 'react';
import { Calendar, FileText, Briefcase, Clock, Info } from 'lucide-react';
import { ExperienceRole } from '@/types';
import { cn } from '@/lib/utils/cn';

interface RoleFormFieldsProps {
  role: ExperienceRole;
  onChange: (role: ExperienceRole) => void;
  hasOtherCurrent: boolean;
}

export function RoleFormFields({ role, onChange, hasOtherCurrent }: RoleFormFieldsProps) {
  const checkboxId = useId();
  const [startDate, setStartDate] = useState(role.startDate || '');
  const [endDate, setEndDate] = useState(role.endDate || '');
  const [isCurrent, setIsCurrent] = useState(role.isCurrent);

  useEffect(() => {
    setStartDate(role.startDate || '');
    setEndDate(role.endDate || '');
    setIsCurrent(role.isCurrent);
  }, [role]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onChange({ ...role, startDate: value });
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onChange({ ...role, endDate: value || null, isCurrent: false });
  };

  const handleIsCurrentChange = (checked: boolean) => {
    setIsCurrent(checked);
    if (checked) {
      setEndDate('');
      onChange({ ...role, endDate: null, isCurrent: true });
    } else {
      const defaultEnd = new Date().toISOString().slice(0, 7);
      setEndDate(defaultEnd);
      onChange({ ...role, endDate: defaultEnd, isCurrent: false });
    }
  };

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

  const getPeriodDisplay = () => {
    if (!startDate) return 'Select dates';
    if (isCurrent) return `${formatDate(startDate)} – Present`;
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const hasDateError = startDate && endDate && endDate < startDate;

  return (
    <div className="space-y-6 pt-4">
      {/* Job Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Job Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Briefcase
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            value={role.jobTitle}
            onChange={(e) => onChange({ ...role, jobTitle: e.target.value })}
            placeholder="e.g. Lead Software Engineer"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
            required
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Duration</label>
          <span className="text-xs font-semibold text-[var(--primary-500)]">
            {getPeriodDisplay()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Start Date</label>
            <input
              type="month"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">End Date</label>
            <input
              type="month"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className={cn(
                'w-full px-4 py-3 rounded-lg border transition-colors bg-[var(--bg-base)] text-[var(--text-primary)]',
                isCurrent
                  ? 'bg-[var(--bg-hover)] opacity-50 cursor-not-allowed border-[var(--border-subtle)]'
                  : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]',
                hasDateError && 'border-red-500'
              )}
              disabled={isCurrent}
              required={!isCurrent}
            />
          </div>
        </div>

        {hasDateError && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-500">
            <Info size={14} />
            <span>End date must be after start date.</span>
          </div>
        )}

        {/* Current Role Toggle */}
        <label
          className={cn(
            'flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer',
            isCurrent
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-[var(--bg-hover)] border-[var(--border-subtle)] hover:border-[var(--text-tertiary)]',
            hasOtherCurrent && !isCurrent && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => handleIsCurrentChange(e.target.checked)}
              className="w-5 h-5 rounded accent-emerald-500"
              id={checkboxId}
              disabled={hasOtherCurrent && !isCurrent}
            />
            <div>
              <span
                className={cn(
                  'block text-sm font-semibold',
                  isCurrent ? 'text-emerald-700' : 'text-[var(--text-primary)]'
                )}
              >
                Current Role
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">
                I am currently working in this role.
              </span>
            </div>
          </div>
          {hasOtherCurrent && !isCurrent && (
            <span className="text-[10px] font-bold text-red-500 uppercase">
              One active role only
            </span>
          )}
        </label>
      </div>

      {/* Role Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={role.description}
          onChange={(e) => onChange({ ...role, description: e.target.value })}
          placeholder="Describe your responsibilities and achievements in this role..."
          className="w-full px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors min-h-[160px] resize-none"
          rows={5}
          required
        />
        <div className="flex justify-between items-center text-[10px] text-[var(--text-tertiary)] font-medium">
          <span>Markdown supported</span>
          <span>Focus on impact and results.</span>
        </div>
      </div>
    </div>
  );
}
