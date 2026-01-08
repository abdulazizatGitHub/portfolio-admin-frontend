'use client';

import React from 'react';
import { Select } from '../Select';

interface SelectOption {
  value: string;
  label: string;
}

interface FieldSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  multiple?: boolean;
  className?: string;
}

export function FieldSelect({
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
  options = [],
  multiple = false,
  className = '',
}: FieldSelectProps) {
  return (
    <div className={className}>
      <Select
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error}
        options={options}
        value={value || (multiple ? [] : '')}
        onChange={onChange}
        onBlur={onBlur}
        multiple={multiple}
      />
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}


