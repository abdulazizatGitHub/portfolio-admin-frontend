import React from 'react';
import { useField } from 'formik';
import { Select } from '@/components/ui/Select';

interface SelectOption {
  value: string;
  label: string;
}

interface FormikSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export function FormikSelect({
  name,
  label,
  required = false,
  options,
  placeholder,
  ...props
}: FormikSelectProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Select
      {...field}
      {...props}
      label={label}
      required={required}
      options={options}
      placeholder={placeholder}
      error={hasError ? meta.error : undefined}
    />
  );
}


