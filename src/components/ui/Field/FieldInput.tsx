'use client';

import React from 'react';
import { Input } from '../Input';

interface FieldInputProps {
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
  type?: 'text' | 'email' | 'url' | 'tel' | 'number';
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function FieldInput({
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
  type = 'text',
  className = '',
  min,
  max,
  step,
}: FieldInputProps) {
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
        type={type}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
      />
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}


