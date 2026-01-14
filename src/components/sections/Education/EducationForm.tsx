'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, FileText, Save, X, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { educationSchema } from '@/lib/validations/schemas';
import type { EducationEntry } from '@/types';
import { cn } from '@/lib/utils/cn';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

/**
 * Helper component to sync the hidden period field with the date inputs
 */
function PeriodSyncer({
  startYear,
  endYear,
  isPresent,
  generatePeriod
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
      {({ isSubmitting, errors, values, setFieldValue }) => {
        return (
          <Form className="max-w-4xl mx-auto space-y-10 pb-20">
            <PeriodSyncer
              startYear={startYear}
              endYear={endYear}
              isPresent={isPresent}
              generatePeriod={generatePeriod}
            />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-10"
            >
              {/* Academic Identity */}
              <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Education Details</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Degree and institution details</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                    Degree Title <span className="text-[var(--error-500)]">*</span>
                  </label>
                  <div className="relative group/input">
                    <BookOpen size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                    <input
                      name="title"
                      type="text"
                      value={values.title}
                      onChange={(e) => setFieldValue('title', e.target.value)}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      className={cn(
                        "w-full pl-12 pr-5 py-4 rounded-2xl border transition-all premium-input text-sm",
                        errors.title ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--primary-500)]"
                      )}
                    />
                  </div>
                  {errors.title && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.title}</p>}
                </div>
              </motion.section>

              {/* Temporal Spectrum */}
              <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--warning-500)] to-transparent"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-[var(--warning-500)]/10 text-[var(--warning-500)]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Date Range</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">When did you start and finish?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                      Start Date <span className="text-[var(--error-500)]">*</span>
                    </label>
                    <div className="relative group/input">
                      <Clock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--warning-500)] transition-colors" />
                      <input
                        type="month"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input focus:border-[var(--warning-500)] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                      End Date {!isPresent && <span className="text-[var(--error-500)]">*</span>}
                    </label>
                    <div className="relative group/input">
                      <CheckCircle2 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--warning-500)] transition-colors" />
                      <input
                        type="month"
                        value={endYear}
                        disabled={isPresent}
                        onChange={(e) => setEndYear(e.target.value)}
                        className={cn(
                          "w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input focus:border-[var(--warning-500)] text-sm",
                          isPresent && "opacity-50 grayscale cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between p-5 rounded-3xl bg-[var(--warning-500)]/[0.03] border border-[var(--warning-500)]/10">
                  <label className="flex items-center gap-4 cursor-pointer group/toggle">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) => {
                        setIsPresent(e.target.checked);
                        if (e.target.checked) setEndYear('');
                      }}
                      className="w-5 h-5 rounded-lg accent-[var(--warning-500)] cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-bold text-[var(--text-primary)] tracking-tight">Currently Studying</span>
                      <span className="block text-[10px] font-medium text-[var(--text-tertiary)]">I am currently enrolled in this program.</span>
                    </div>
                  </label>

                  {startYear && (
                    <div className="text-right">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Generated Period</span>
                      <span className="block text-sm font-bold text-[var(--warning-500)] tracking-tight">
                        {generatePeriod(startYear, endYear, isPresent)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Scholastic Narrative */}
              <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--success-500)] to-transparent"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-[var(--success-500)]/10 text-[var(--success-500)]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Description</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Describe your studies and accomplishments</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={(e) => setFieldValue('description', e.target.value)}
                    placeholder="Narrate your academic achievements and area of focus..."
                    className={cn(
                      "w-full px-5 py-4 rounded-[32px] border transition-all premium-input min-h-[160px] resize-none text-sm",
                      errors.description ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--success-500)]"
                    )}
                    rows={5}
                  />
                  {errors.description && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.description}</p>}
                </div>
              </motion.section>

              {/* Form Actions */}
              <motion.div
                variants={sectionVariants}
                className="flex items-center justify-between p-8 glass-panel rounded-[40px] border-t-4 border-t-[var(--primary-500)]"
              >
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                  className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95 flex items-center gap-2"
                >
                  <X size={14} />
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={isSubmitting || isLoading}
                  className="px-12 py-4 rounded-2xl shadow-xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2 text-white"
                  disabled={!startYear || (!endYear && !isPresent) || !values.title || !values.description}
                >
                  {!isSubmitting && !isLoading && <Save size={14} />}
                  <span>{initialData?.id ? 'Save Changes' : 'Create Education'}</span>
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        );
      }}
    </Formik>
  );
}
