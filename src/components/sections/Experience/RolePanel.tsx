'use client';

import { X } from 'lucide-react';
import { ExperienceRole } from '@/types';
import { RoleHeader } from './RoleHeader';
import { RoleFormFields } from './RoleFormFields';

interface RolePanelProps {
  role: ExperienceRole;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (role: ExperienceRole) => void;
  onRemove: () => void;
  canRemove: boolean;
  hasOtherCurrent: boolean; // Whether another role is marked as current
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
      className={`role-panel ${isExpanded ? 'role-panel-expanded' : ''}`}
      id={`role-panel-${role.id}`}
    >
      <div className="role-panel-header-wrapper">
        <RoleHeader role={role} isExpanded={isExpanded} onToggle={onToggle} />
        {canRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="role-remove-button"
            title="Remove role"
            aria-label={`Remove ${role.jobTitle || 'role'}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="role-panel-content">
          <RoleFormFields
            role={role}
            onChange={onChange}
            hasOtherCurrent={hasOtherCurrent}
          />
        </div>
      )}
    </div>
  );
}


