'use client';

import { Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'live' | 'draft' | 'development' | 'archived';
}

const statusConfig = {
  live: {
    label: 'Live',
    color: 'var(--success-500)',
    bgColor: 'var(--success-100)',
    textColor: 'var(--success-700)',
  },
  draft: {
    label: 'Draft',
    color: 'var(--text-tertiary)',
    bgColor: 'var(--bg-hover)',
    textColor: 'var(--text-secondary)',
  },
  development: {
    label: 'In Development',
    color: 'var(--info-500)',
    bgColor: 'var(--info-100)',
    textColor: 'var(--info-700)',
  },
  archived: {
    label: 'Archived',
    color: 'var(--warning-500)',
    bgColor: 'var(--warning-100)',
    textColor: 'var(--warning-700)',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className="status-badge"
      style={{
        background: config.bgColor,
        color: config.textColor,
      }}
    >
      <Circle size={8} fill={config.color} stroke="none" className="status-dot" />
      <span>{config.label}</span>
    </div>
  );
}


