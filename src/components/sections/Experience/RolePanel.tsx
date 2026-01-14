'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExperienceRole } from '@/types';
import { RoleHeader } from './RoleHeader';
import { RoleFormFields } from './RoleFormFields';
import { cn } from '@/lib/utils/cn';

interface RolePanelProps {
  role: ExperienceRole;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (role: ExperienceRole) => void;
  onRemove: () => void;
  canRemove: boolean;
  hasOtherCurrent: boolean;
}

export function RolePanel({
  role,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
  canRemove,
  hasOtherCurrent,
}: RolePanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-[32px] transition-all duration-500 overflow-hidden",
        isExpanded
          ? "glass-panel ring-1 ring-white/10 shadow-2xl"
          : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10"
      )}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <RoleHeader role={role} isExpanded={isExpanded} onToggle={onToggle} />
        </div>

        {canRemove && (
          <div className="px-6 border-l border-white/5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-95 group/remove"
              title="Terminate Role"
              aria-label={`Terminate ${role.jobTitle || 'role'}`}
            >
              <Trash2 size={16} className="group-hover/remove:animate-bounce" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8 pt-4 border-t border-white/5">
              <RoleFormFields
                role={role}
                onChange={onChange}
                hasOtherCurrent={hasOtherCurrent}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow for Expanded State */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)] to-transparent pointer-events-none -z-10"
        />
      )}
    </div>
  );
}
