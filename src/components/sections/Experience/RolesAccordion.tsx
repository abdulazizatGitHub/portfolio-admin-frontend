'use client';

import React from 'react';
import { Plus, Info, Layers } from 'lucide-react';
import { ExperienceRole } from '@/types';
import { RolePanel } from './RolePanel';
import { cn } from '@/lib/utils/cn';

interface RolesAccordionProps {
  roles: ExperienceRole[];
  expandedRoleId: string | null;
  onExpand: (roleId: string) => void;
  onCollapse: () => void;
  onRoleChange: (roleId: string, updatedRole: ExperienceRole) => void;
  onRoleRemove: (roleId: string) => void;
  onAddRole: () => void;
}

export function RolesAccordion({
  roles,
  expandedRoleId,
  onExpand,
  onCollapse,
  onRoleChange,
  onRoleRemove,
  onAddRole,
}: RolesAccordionProps) {
  const handleToggle = (roleId: string) => {
    if (expandedRoleId === roleId) {
      onCollapse();
    } else {
      onExpand(roleId);
    }
  };

  const getHasOtherCurrent = (currentRoleId: string) => {
    return roles.some((role) => role.id !== currentRoleId && role.isCurrent);
  };

  const isCurrentRoleValid = () => {
    if (!expandedRoleId) return true;
    const expandedRole = roles.find((r) => r.id === expandedRoleId);
    if (!expandedRole) return true;
    return expandedRole.jobTitle.trim() !== '' && expandedRole.startDate !== '';
  };

  return (
    <div className="space-y-4">
      {/* Roles List */}
      <div className="space-y-3">
        {roles.map((role) => {
          const isExpanded = expandedRoleId === role.id;
          const hasOtherCurrent = getHasOtherCurrent(role.id);

          return (
            <RolePanel
              key={role.id}
              role={role}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(role.id)}
              onChange={(updatedRole) => onRoleChange(role.id, updatedRole)}
              onRemove={() => onRoleRemove(role.id)}
              canRemove={roles.length > 1}
              hasOtherCurrent={hasOtherCurrent}
            />
          );
        })}
      </div>

      {/* Add Role Control */}
      <div className="pt-2">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onAddRole}
            disabled={!isCurrentRoleValid()}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg transition-colors border-2',
              isCurrentRoleValid()
                ? 'bg-[var(--primary-500)]/10 border-[var(--primary-500)] text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                : 'bg-[var(--bg-base)] border-dashed border-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed'
            )}
          >
            <Plus size={18} />
            <span className="text-sm font-semibold">Add Another Role</span>
          </button>

          {!isCurrentRoleValid() && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Info size={14} />
              <p className="text-xs font-medium">
                Please complete the current role details before adding another.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
