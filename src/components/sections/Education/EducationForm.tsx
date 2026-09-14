'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { GraduationCap, Calendar, FileText, Save, X, Building } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { educationSchema } from '@/lib/validations/schemas';
import type { EducationEntry } from '@/types';
import { cn } from '@/lib/utils/cn';

/**
 * Helper component to sync the hidden period field with the date inputs
 */
function PeriodSyncer({
  startYear,
  endYear,
  isPresent,
  generatePeriod,
}: {
  startYear: string;
  endYear: string;
  isPresent: boolean;
  generatePeriod: (start: string, end: string, present: boolean) => string;
}) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const period = generatePeriod(startYear, endYear, isPresent);
    setFieldValue('period', period);
  }, [startYear, endYear, isPresent, setFieldValue, generatePeriod]);

  return null;
}

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
  const isEdit = !!initialData?.id;
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isPresent, setIsPresent] = useState(false);

  useEffect(() => {
    if (initialData?.period) {
      const parts = initialData.period.split(' - ');
      if (parts.length === 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();

        const parseDate = (dateStr: string) => {
          if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return dateStr;
          }
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

  const generatePeriod = (start: string, end: string, present: boolean) => {
    if (!start) return '';

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
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
    const period = generatePeriod(startYear, endYear, isPresent);

    const educationData: EducationEntry = {
      ...initialData,
      ...values,
      period,
      orderIndex: initialData?.orderIndex ?? 0,
    } as EducationEntry;
    await onSubmit(educationData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={educationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors, values, setFieldValue }) => (
        <Form className="space-y-6">
          <PeriodSyncer
            startYear={startYear}
            endYear={endYear}
            isPresent={isPresent}
            generatePeriod={generatePeriod}
          />

          {/* Degree Title Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)] flex items-center justify-center">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Degree / Certificate
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Your qualification title and institution
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Degree Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                value={values.title}
                onChange={(e) => setFieldValue('title', e.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
                className={cn(
                  'w-full px-4 py-4 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/20',
                  errors.title
                    ? 'border-red-500'
                    : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                )}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>
          </section>

          {/* Date Range Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Calendar size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Duration</h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  When did you study this program?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] text-base focus:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  End Date {!isPresent && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="month"
                  value={endYear}
                  disabled={isPresent}
                  onChange={(e) => setEndYear(e.target.value)}
                  className={cn(
                    'w-full px-4 py-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] text-base focus:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/20 transition-colors',
                    isPresent && 'opacity-50 cursor-not-allowed bg-[var(--bg-hover)]'
                  )}
                />
              </div>
            </div>

            {/* Currently Studying Toggle */}
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPresent}
                  onChange={(e) => {
                    setIsPresent(e.target.checked);
                    if (e.target.checked) setEndYear('');
                  }}
                  className="w-5 h-5 rounded accent-[var(--primary-500)]"
                />
                <div>
                  <span className="block text-sm font-medium text-[var(--text-primary)]">
                    Currently studying here
                  </span>
                  <span className="block text-xs text-[var(--text-tertiary)]">
                    I&apos;m still enrolled in this program
                  </span>
                </div>
              </label>

              {startYear && (
                <div className="text-right hidden sm:block">
                  <span className="block text-xs text-[var(--text-tertiary)]">Period Preview</span>
                  <span className="block text-sm font-semibold text-[var(--primary-500)]">
                    {generatePeriod(startYear, endYear, isPresent)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Description Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Description</h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Describe your studies, achievements, and focus area
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                About this education
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={(e) => setFieldValue('description', e.target.value)}
                placeholder="Describe what you studied, key achievements, relevant coursework, or skills gained..."
                className={cn(
                  'w-full px-4 py-4 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] text-base transition-colors resize-none min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/20',
                  errors.description
                    ? 'border-red-500'
                    : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                )}
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="px-6 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <Button
              type="submit"
              loading={isSubmitting || isLoading}
              className="px-8 py-3 text-base flex items-center gap-2"
              disabled={
                !startYear || (!endYear && !isPresent) || !values.title || !values.description
              }
            >
              {!isSubmitting && !isLoading && <Save size={18} />}
              {isEdit ? 'Save Changes' : 'Add Education'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
