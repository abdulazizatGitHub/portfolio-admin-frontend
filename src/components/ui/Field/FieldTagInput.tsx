'use client';

import React from 'react';
import { TagInput } from '../TagInput';

interface FieldTagInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  className?: string;
}

export function FieldTagInput({
  name,
  label,
  placeholder = 'Add a tag and press Enter',
  required = false,
  disabled = false,
  helpText,
  error,
  value = [],
  onChange,
  onBlur,
  className = '',
}: FieldTagInputProps) {
  return (
    <div className={className}>
      <TagInput
        tags={value}
        onChange={onChange}
        placeholder={placeholder}
        label={label}
        error={error}
      />
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

