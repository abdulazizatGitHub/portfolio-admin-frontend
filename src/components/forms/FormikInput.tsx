import React from 'react';
import { useField } from 'formik';
import { Input } from '@/components/ui/Input';

interface FormikInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
}

export function FormikInput({ name, label, required = false, ...props }: FormikInputProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Input
      {...field}
      {...props}
      label={label}
      required={required}
      error={hasError ? meta.error : undefined}
    />
  );
}


