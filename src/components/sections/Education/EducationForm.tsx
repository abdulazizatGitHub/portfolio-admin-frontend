'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { FormikField } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { FormSection } from '@/components/ui/FormSection';
import { educationSchema } from '@/lib/validations/schemas';
import type { EducationEntry } from '@/types';

interface EducationFormProps {
  initialData?: Partial<EducationEntry>;
  onSubmit: (data: EducationEntry) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EducationFormProps) {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isPresent, setIsPresent] = useState(false);

  // Parse initial period if exists (e.g., "Jan 2018 - Dec 2022" or "2018-01 - 2022-12")
  useEffect(() => {
    if (initialData?.period) {
      const parts = initialData.period.split(' - ');
      if (parts.length === 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();
        
        // Try to parse date format (YYYY-MM or "Month YYYY")
        const parseDate = (dateStr: string) => {
          // If already in YYYY-MM format
          if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return dateStr;
          }
          // If in "Month YYYY" or "YYYY" format, convert to YYYY-01
          const match = dateStr.match(/(\d{4})/);
          if (match) {
            return `${match[1]}-01`;
          }
          return '';
        };

        setStartYear(parseDate(startPart));
        
        if (endPart.toLowerCase() === 'present') {
          setIsPresent(true);
          setEndYear('');
        } else {
          setEndYear(parseDate(endPart));
          setIsPresent(false);
        }
      }
    }
  }, [initialData?.period]);

  // Generate period string from dates (format: "Jan 2018 - Dec 2022")
  const generatePeriod = (start: string, end: string, present: boolean) => {
    if (!start) return '';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [year, month] = dateStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    };

    const formattedStart = formatDate(start);
    if (present) return `${formattedStart} - Present`;
    if (!end) return formattedStart;
    const formattedEnd = formatDate(end);
    return `${formattedStart} - ${formattedEnd}`;
  };

  const initialValues: Partial<EducationEntry> = {
    period: initialData?.period || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
  };

  const handleSubmit = async (values: any) => {
    // Generate period from date fields
    const period = generatePeriod(startYear, endYear, isPresent);
    
    const educationData: EducationEntry = {
      ...initialData,
      ...values,
      period,
      orderIndex: initialData?.orderIndex ?? 0,
    };
    await onSubmit(educationData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={educationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => {
        // Update hidden period field whenever dates change
        useEffect(() => {
          const period = generatePeriod(startYear, endYear, isPresent);
          setFieldValue('period', period);
        }, [startYear, endYear, isPresent, setFieldValue]);

        return (
          <Form>
            <FormSection
              title="Education Details"
              description="Enter the details of your education entry"
            >
              {/* Date Pickers for Period */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="startDate" className="form-label">
                      Start Date (Month & Year) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="startDate"
                      type="month"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      placeholder="Select start date"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="endDate" className="form-label">
                      End Date (Month & Year) {!isPresent && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="endDate"
                      type="month"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      placeholder="Select end date"
                      className="form-input"
                      disabled={isPresent}
                      required={!isPresent}
                    />
                  </div>
                </div>

                <div className="form-checkbox-wrapper">
                  <input
                    id="isPresent"
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) => {
                      setIsPresent(e.target.checked);
                      if (e.target.checked) {
                        setEndYear('');
                      }
                    }}
                    className="form-checkbox"
                  />
                  <label htmlFor="isPresent" className="text-sm text-[var(--text-primary)] cursor-pointer">
                    Currently studying here
                  </label>
                </div>

                {/* Preview of generated period */}
                {startYear && (
                  <div className="text-sm text-[var(--text-secondary)]">
                    Period: <span className="font-medium text-[var(--text-primary)]">
                      {generatePeriod(startYear, endYear, isPresent)}
                    </span>
                  </div>
                )}
              </div>

              {/* Hidden field to store the period value */}
              <input type="hidden" name="period" />

              <FormikField
                name="title"
                type="text"
                label="Title"
                required
                placeholder="e.g., Bachelor of Science in Computer Science"
              />

              <FormikField
                name="description"
                type="textarea"
                label="Description"
                required
                rows={4}
                placeholder="Graduated with honors. Focused on software engineering..."
              />
            </FormSection>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting || isLoading}
                className="cursor-pointer"
                disabled={!startYear || (!endYear && !isPresent)}
              >
                {initialData?.id ? 'Update' : 'Create'} Education Entry
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

