'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'relative font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary:
      'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] focus:ring-[var(--accent-primary)]',
    secondary:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--accent-primary)]',
    danger:
      'bg-[var(--danger)] text-white hover:opacity-90 focus:ring-[var(--danger)]',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--accent-primary)]',
  };

  const sizeClasses = {
    sm: 'px-3 h-8 text-sm',
    md: 'px-4 h-10 text-sm',
    lg: 'px-6 h-12 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
