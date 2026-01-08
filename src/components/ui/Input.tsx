'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({
  label,
  error,
  success = false,
  required = false,
  prefix,
  suffix,
  className = '',
  id,
  type = 'text',
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {/* Standard Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-primary)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            {prefix}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          id={inputId}
          className={cn(
            'w-full h-10 px-3 rounded-md border transition-colors',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'placeholder:text-[var(--text-tertiary)]',
            prefix && 'pl-10',
            (suffix || success || error) && 'pr-10',
            error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:ring-opacity-20'
              : success
              ? 'border-[var(--success)] focus:border-[var(--success)] focus:ring-2 focus:ring-[var(--success)] focus:ring-opacity-20'
              : 'border-[var(--border-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20',
            'disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-label={label || props['aria-label']}
          {...props}
        />

        {/* Success Icon */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--success)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--danger)]">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}

        {/* Suffix */}
        {suffix && !success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            {suffix}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-[var(--danger)] flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
