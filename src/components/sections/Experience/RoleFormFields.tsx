'use client';

import React, { useState, useEffect, useId } from 'react';
import { Calendar, FileText, Info, Sparkles, Zap, Briefcase, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getPeriodDisplay = () => {
    if (!startDate) return 'Select Dates';
    if (isCurrent) return `${formatDate(startDate)} – Present`;
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const hasDateError = startDate && endDate && endDate < startDate;

  return (
    <div className="space-y-10">
      {/* Designation Core */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
          <Briefcase size={14} className="text-[var(--primary-500)]" />
          Job Title <span className="text-[var(--error-500)] ml-0.5">*</span>
        </label>
        <div className="relative group/input">
          <input
            type="text"
            value={role.jobTitle}
            onChange={(e) => onChange({ ...role, jobTitle: e.target.value })}
            placeholder="e.g., Software Engineer"
            className="w-full px-6 py-4 rounded-2xl border-2 border-white/5 focus:border-[var(--primary-500)] transition-all bg-white/[0.03] outline-none premium-input font-medium"
            required
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
            <Zap size={16} className="text-[var(--primary-500)]" />
          </div>
        </div>
      </div>

      {/* Temporal Spectrum */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            <Clock size={14} className="text-[var(--accent-500)]" />
            Role Duration
          </label>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
              {getPeriodDisplay()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider ml-1">Start Date</label>
            <input
              type="month"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-white/5 focus:border-[var(--accent-500)] transition-all bg-white/[0.03] premium-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider ml-1">End Date</label>
            <input
              type="month"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className={cn(
                "w-full px-5 py-3.5 rounded-xl border-2 transition-all premium-input",
                isCurrent ? "bg-white/[0.01] border-white/5 opacity-50 cursor-not-allowed" : "bg-white/[0.03] border-white/5 focus:border-[var(--accent-500)]",
                hasDateError && "border-[var(--error-500)]"
              )}
              disabled={isCurrent}
              required={!isCurrent}
              min={startDate || undefined}
            />
          </div>
        </div>

        {hasDateError && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest"
          >
            <Info size={12} />
            Invalid Dates: End date must be after start date.
          </motion.div>
        )}

        {/* Current Role Toggle */}
        <div className="pt-2">
          <label className={cn(
            "flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all duration-300 cursor-pointer group/toggle overflow-hidden relative",
            isCurrent
              ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
              : "bg-white/[0.02] border-white/5 hover:border-white/10",
            hasOtherCurrent && !isCurrent && "opacity-40 cursor-not-allowed grayscale"
          )}>
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => handleIsCurrentChange(e.target.checked)}
              className="w-5 h-5 rounded-lg accent-emerald-500 cursor-pointer z-10"
              id={checkboxId}
              disabled={hasOtherCurrent && !isCurrent}
            />
            <div className="flex-1 relative z-10">
              <span className={cn(
                "block text-xs font-bold uppercase tracking-widest mb-0.5 transition-colors",
                isCurrent ? "text-emerald-500" : "text-[var(--text-secondary)]"
              )}>
                Current Role
              </span>
              <span className="block text-[10px] font-medium text-[var(--text-tertiary)] ml-2">
                {isCurrent ? "I am currently working in this role." : "This is a past role."}
              </span>
            </div>

            {isCurrent && (
              <motion.div
                layoutId="active-sparkle"
                className="relative z-10"
              >
                <Sparkles size={18} className="text-emerald-500" />
              </motion.div>
            )}

            {hasOtherCurrent && !isCurrent && (
              <div className="text-[9px] font-bold uppercase tracking-tighter text-[var(--error-500)] text-right relative z-10">
                Only one role can be current
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Narrative Architecture */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
          <FileText size={14} className="text-[var(--info-500)]" />
          Role Description <span className="text-[var(--error-500)] ml-0.5">*</span>
        </label>
        <div className="relative group/input">
          <textarea
            value={role.description}
            onChange={(e) => onChange({ ...role, description: e.target.value })}
            placeholder="Describe your responsibilities and achievements..."
            className="w-full px-6 py-5 rounded-[32px] border-2 border-white/5 focus:border-[var(--info-500)] transition-all bg-white/[0.03] outline-none premium-input font-medium min-h-[180px] resize-none"
            rows={6}
            required
          />
          <div className="absolute right-6 bottom-6 flex items-center gap-3">
            <div className="p-1 px-2 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
              Markdown supported
            </div>
          </div>
        </div>
        <p className="px-4 text-[10px] font-medium text-[var(--text-tertiary)] leading-relaxed">
          Focus on your specific contributions and impact.
        </p>
      </div>
    </div>
  );
}
