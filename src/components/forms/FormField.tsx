import React from 'react';
import { useField } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  children: (field: any, meta: any) => React.ReactNode;
}

export function FormField({ name, label, required = false, children }: FormFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children(field, meta)}
      {hasError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}


