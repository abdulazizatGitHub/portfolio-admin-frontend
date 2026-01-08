'use client';

import { Plus } from 'lucide-react';
import { ExperienceRole } from '@/types';
import { RolePanel } from './RolePanel';

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

  // Check if any role other than the current one is marked as current
  const getHasOtherCurrent = (currentRoleId: string) => {
    return roles.some(
      (role) => role.id !== currentRoleId && role.isCurrent
    );
  };

  // Check if the currently expanded role is valid (has job title and start date)
  const isCurrentRoleValid = () => {
    if (!expandedRoleId) return true;
    const expandedRole = roles.find((r) => r.id === expandedRoleId);
    if (!expandedRole) return true;
    return expandedRole.jobTitle.trim() !== '' && expandedRole.startDate !== '';
  };

  return (
    <div className="roles-accordion">
      <div className="roles-accordion-header">
        <h3 className="roles-accordion-title">
          Roles ({roles.length})
        </h3>
      </div>

      <div className="roles-accordion-list">
        {roles.map((role, index) => {
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

      <div className="roles-accordion-footer">
        <button
          type="button"
          onClick={onAddRole}
          className="btn-secondary btn-sm"
          disabled={!isCurrentRoleValid()}
        >
          <Plus size={16} />
          Add Role
        </button>
        {!isCurrentRoleValid() && (
          <p className="form-hint text-xs mt-2">
            Complete the current role (job title and start date) before adding another
          </p>
        )}
      </div>
    </div>
  );
}


