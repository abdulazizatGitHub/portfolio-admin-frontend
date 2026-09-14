'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
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
        'relative rounded-xl transition-all overflow-hidden border',
        isExpanded
          ? 'bg-[var(--bg-surface)] border-[var(--primary-500)] shadow-sm'
          : 'bg-[var(--bg-base)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]'
      )}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <RoleHeader role={role} isExpanded={isExpanded} onToggle={onToggle} />
        </div>

        {canRemove && (
          <div className="px-4 border-l border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              title="Remove Role"
              aria-label={`Remove ${role.jobTitle || 'role'}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 pt-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <RoleFormFields role={role} onChange={onChange} hasOtherCurrent={hasOtherCurrent} />
        </div>
      )}
    </div>
  );
}
