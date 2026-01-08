import React from 'react';
import { useField, useFormikContext } from 'formik';
import { TagInput } from '@/components/ui/TagInput';

interface FormikTagInputProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export function FormikTagInput({ name, label, placeholder }: FormikTagInputProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const { setFieldValue } = useFormikContext();
  const hasError = meta.touched && meta.error;

  return (
    <TagInput
      tags={field.value || []}
      onChange={(tags) => {
        helpers.setValue(tags);
        setFieldValue(name, tags);
      }}
      placeholder={placeholder}
      label={label}
      error={hasError ? meta.error : undefined}
    />
  );
}


