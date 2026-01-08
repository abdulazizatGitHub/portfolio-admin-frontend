'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--border-primary)]',
    success: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success)]',
    warning: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning)]',
    danger: 'bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger)]',
    info: 'bg-[var(--info-bg)] text-[var(--info-text)] border-[var(--info)]',
    secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
