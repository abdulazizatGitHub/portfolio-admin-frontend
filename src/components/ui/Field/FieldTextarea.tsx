'use client';

import React from 'react';
import { Textarea } from '../Textarea';

interface FieldTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}

export function FieldTextarea({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  helpText,
  error,
  value,
  onChange,
  onBlur,
  rows = 4,
  className = '',
}: FieldTextareaProps) {
  return (
    <div className={className}>
      <Textarea
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error}
        rows={rows}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
      />
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}


