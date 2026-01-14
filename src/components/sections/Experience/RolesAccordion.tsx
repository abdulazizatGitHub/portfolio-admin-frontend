'use client';

import React from 'react';
import { Plus, Briefcase, Info, Save, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    return roles.some(
      (role) => role.id !== currentRoleId && role.isCurrent
    );
  };

  const isCurrentRoleValid = () => {
    if (!expandedRoleId) return true;
    const expandedRole = roles.find((r) => r.id === expandedRoleId);
    if (!expandedRole) return true;
    return expandedRole.jobTitle.trim() !== '' && expandedRole.startDate !== '';
  };

  return (
    <div className="space-y-8">
      {/* Accordion Header Meta */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--primary-500)]/10 text-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/5">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">
              Hierarchical Roles
            </h3>
            <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic">
              Synchronizing {roles.length} professional node{roles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Role Nodes Matrix */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {roles.map((role, index) => {
            const isExpanded = expandedRoleId === role.id;
            const hasOtherCurrent = getHasOtherCurrent(role.id);

            return (
              <motion.div
                key={role.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <RolePanel
                  role={role}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggle(role.id)}
                  onChange={(updatedRole) => onRoleChange(role.id, updatedRole)}
                  onRemove={() => onRoleRemove(role.id)}
                  canRemove={roles.length > 1}
                  hasOtherCurrent={hasOtherCurrent}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Orchestration Controls */}
      <div className="pt-4 border-t border-dashed border-white/10">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onAddRole}
            disabled={!isCurrentRoleValid()}
            className={cn(
              "group relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95",
              isCurrentRoleValid()
                ? "bg-[var(--primary-500)]/10 border-2 border-[var(--primary-500)] text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white"
                : "bg-white/5 border-2 border-dashed border-white/10 text-[var(--text-tertiary)] cursor-not-allowed"
            )}
          >
            <Plus size={18} className={cn("transition-transform duration-300", isCurrentRoleValid() && "group-hover:rotate-90")} />
            <span className="text-xs font-black uppercase tracking-widest">Acknowledge New Role</span>

            {/* Gloss Highlight for Active State */}
            {isCurrentRoleValid() && (
              <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 animate-[shimmer_2s_infinite] pointer-events-none" />
            )}
          </button>

          {!isCurrentRoleValid() && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500"
            >
              <Info size={14} className="animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-wider leading-none">
                Protocol Interrupted: Finalize active role parameters before initialization.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
