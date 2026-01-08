import React from 'react';
import { useField } from 'formik';
import { Textarea } from '@/components/ui/Textarea';

interface FormikTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  required?: boolean;
}

export function FormikTextarea({ name, label, required = false, ...props }: FormikTextareaProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Textarea
      {...field}
      {...props}
      label={label}
      required={required}
      error={hasError ? meta.error : undefined}
    />
  );
}


