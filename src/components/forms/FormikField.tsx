'use client';

import React from 'react';
import { Field as FormikFieldComponent } from 'formik';
import { Field, FieldComponentProps } from '@/components/ui/Field';

export interface FormikFieldProps extends Omit<FieldComponentProps, 'value' | 'onChange' | 'onBlur'> {
  name: string;
}

export function FormikField(props: FormikFieldProps) {
  return (
    <FormikFieldComponent name={props.name}>
      {({ field, meta }: any) => (
        <Field
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={meta.touched && meta.error ? meta.error : undefined}
        />
      )}
    </FormikFieldComponent>
  );
}

