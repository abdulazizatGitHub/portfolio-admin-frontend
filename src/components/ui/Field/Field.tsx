'use client';

import React from 'react';
import { FieldProps, useField } from 'formik';
import { FieldInput } from './FieldInput';
import { FieldTextarea } from './FieldTextarea';
import { FieldSelect } from './FieldSelect';
import { FieldTagInput } from './FieldTagInput';
import { FieldDate } from './FieldDate';
import { FieldTime } from './FieldTime';
import { FieldDateTime } from './FieldDateTime';
import { FieldColorPicker } from './FieldColorPicker';
import { FieldSearchableSelect } from './FieldSearchableSelect';
import { FieldPassword } from './FieldPassword';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'tag'
  | 'date'
  | 'time'
  | 'datetime'
  | 'color'
  | 'searchable-select'
  | 'url'
  | 'number'
  | 'tel';

export interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

export interface FieldComponentProps extends BaseFieldProps {
  type?: FieldType;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  searchable?: boolean;
  format?: string;
  [key: string]: any;
}

export function Field({
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  disabled = false,
  helpText,
  className = '',
  options = [],
  rows = 4,
  ...props
}: FieldComponentProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  const commonProps = {
    name,
    label,
    placeholder,
    required,
    disabled,
    helpText,
    error: hasError ? meta.error : undefined,
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    className,
    ...props,
  };

  switch (type) {
    case 'textarea':
      return <FieldTextarea {...commonProps} rows={rows} />;
    
    case 'select':
      return <FieldSelect {...commonProps} options={options} />;
    
    case 'searchable-select':
      return <FieldSearchableSelect {...commonProps} options={options} onBlur={() => commonProps.onBlur({} as any)} />;
    
    case 'tag':
      return <FieldTagInput {...commonProps} onBlur={() => commonProps.onBlur({} as any)} />;
    
    case 'date':
      return <FieldDate {...commonProps} />;
    
    case 'time':
      return <FieldTime {...commonProps} />;
    
    case 'datetime':
      return <FieldDateTime {...commonProps} />;
    
    case 'color':
      return <FieldColorPicker {...commonProps} />;
    
    case 'password':
      return <FieldPassword {...commonProps} />;
    
    case 'email':
    case 'url':
    case 'tel':
    case 'number':
    case 'text':
    default:
      return <FieldInput {...commonProps} type={type} />;
  }
}

