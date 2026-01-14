'use client';

import React from 'react';
import { ChevronDown, ChevronRight, Calendar, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getDateRange = () => {
    if (!role.startDate) return 'Dates pending';
    const start = formatDate(role.startDate);
    const end = role.isCurrent || !role.endDate ? 'Present' : formatDate(role.endDate);
    return `${start} – ${end}`;
  };

  const displayTitle = role.jobTitle || 'New Role';
  const dateRange = getDateRange();

  return (
    <button
      type="button"
      className="w-full text-left p-6 md:p-8 outline-none group"
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Visual Indicator Node */}
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
            isExpanded
              ? "bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/20"
              : "bg-white/5 text-[var(--text-tertiary)] group-hover:bg-white/10 group-hover:text-[var(--text-secondary)]"
          )}>
            {isExpanded ? <Sparkles size={20} /> : <Briefcase size={20} />}
          </div>

          <div className="space-y-1.5 min-w-0">
            <h4 className={cn(
              "text-lg font-bold uppercase tracking-tight transition-all duration-300 truncate max-w-[300px] md:max-w-md",
              isExpanded ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
            )}>
              {displayTitle}
            </h4>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded bg-white/5">
                <Calendar size={12} className="text-[var(--text-tertiary)]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] ml-1">
                {dateRange}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {role.isCurrent && !isExpanded && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Current</span>
            </div>
          )}

          <div className={cn(
            "p-2.5 rounded-xl transition-all duration-500",
            isExpanded ? "bg-[var(--primary-500)]/10 text-[var(--primary-500)]" : "bg-white/5 text-[var(--text-tertiary)]"
          )}>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </div>
        </div>
      </div>
    </button>
  );
}
