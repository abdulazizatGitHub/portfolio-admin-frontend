'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { ExperienceRole } from '@/types';

interface RoleHeaderProps {
  role: ExperienceRole;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RoleHeader({ role, isExpanded, onToggle }: RoleHeaderProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  const getDateRange = () => {
    if (!role.startDate) return '';
    const start = formatDate(role.startDate);
    const end = role.isCurrent || !role.endDate ? 'Present' : formatDate(role.endDate);
    return `${start} – ${end}`;
  };

  const displayTitle = role.jobTitle || 'Untitled Role';
  const dateRange = getDateRange();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      className="role-header-button"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      aria-controls={`role-panel-${role.id}`}
    >
      <div className="role-header-content">
        <div className="role-header-left">
          {isExpanded ? (
            <ChevronDown className="role-header-chevron" size={20} />
          ) : (
            <ChevronRight className="role-header-chevron" size={20} />
          )}
          <div className="role-header-info">
            <div className="role-header-title">{displayTitle}</div>
            {dateRange && (
              <div className="role-header-dates">{dateRange}</div>
            )}
          </div>
        </div>
        {role.isCurrent && (
          <span className="role-current-badge">Current</span>
        )}
      </div>
    </button>
  );
}


