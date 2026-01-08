'use client';

import React from 'react';
import { FolderPlus, Briefcase, GraduationCap, Award } from 'lucide-react';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color: string;
}

interface QuickActionsPanelProps {
  onNewProject: () => void;
  onNewSkill: () => void;
  onNewEducation: () => void;
  onNewExperience: () => void;
}

export function QuickActionsPanel({
  onNewProject,
  onNewSkill,
  onNewEducation,
  onNewExperience
}: QuickActionsPanelProps) {
  const actions: QuickAction[] = [
    {
      icon: FolderPlus,
      label: 'New Project',
      onClick: onNewProject,
      color: 'var(--primary-500)'
    },
    {
      icon: Briefcase,
      label: 'New Skill',
      onClick: onNewSkill,
      color: 'var(--secondary-500)'
    },
    {
      icon: GraduationCap,
      label: 'Education',
      onClick: onNewEducation,
      color: 'var(--success-500)'
    },
    {
      icon: Award,
      label: 'Experience',
      onClick: onNewExperience,
      color: 'var(--warning-500)'
    }
  ];
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
        <p className="card-subtitle">Create new entries</p>
      </div>
      
      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="quick-action-btn"
            >
              <div className="quick-action-icon" style={{ color: action.color }}>
                <Icon size={24} />
              </div>
              <span className="quick-action-label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


