'use client';

import React from 'react';

interface FieldColorPickerProps {
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

export function FieldColorPicker({
  name,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  value,
  onChange,
  onBlur,
  className = '',
}: FieldColorPickerProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          id={name}
          name={name}
          type="color"
          value={value || '#000000'}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            h-10 w-20 border rounded cursor-pointer
            ${error ? 'border-red-500' : 'border-gray-300'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <input
          type="text"
          value={value || '#000000'}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="#000000"
          className={`
            flex-1 px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}


