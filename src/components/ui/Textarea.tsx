'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Textarea({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-[var(--text-primary)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={textareaId}
        className={cn(
          'w-full min-h-[120px] px-3 py-2 rounded-md border transition-colors resize-vertical',
          'bg-[var(--bg-primary)] text-[var(--text-primary)]',
          'placeholder:text-[var(--text-tertiary)]',
          error
            ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:ring-opacity-20'
            : 'border-[var(--border-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20',
          'disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
          'focus:outline-none',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        aria-label={label || props['aria-label']}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p
          id={`${textareaId}-error`}
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
