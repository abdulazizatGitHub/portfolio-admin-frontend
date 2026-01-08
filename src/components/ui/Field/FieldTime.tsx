'use client';

import React from 'react';
import { Input } from '../Input';

interface FieldTimeProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export function FieldTime({
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
  className = '',
}: FieldTimeProps) {
  return (
    <div className={className}>
      <Input
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error}
        type="time"
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


