'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';
import type { EducationEntry } from '@/types';

const educationSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  initialData?: Partial<EducationEntry>;
  onSubmit: (data: EducationFormData) => void;
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      period: '',
      title: '',
      description: '',
    },
  });

  // Parse initial period if exists
  useEffect(() => {
    if (initialData?.period) {
      const parts = initialData.period.split(' - ');
      if (parts.length === 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();
        
        // Parse date format
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

  // Generate period string (format: "Jan 2018 - Dec 2022")
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

  // Update period field whenever dates change
  useEffect(() => {
    const period = generatePeriod(startYear, endYear, isPresent);
    setValue('period', period);
  }, [startYear, endYear, isPresent, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Date Pickers */}
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

        {/* Preview */}
        {startYear && (
          <div className="text-sm text-[var(--text-secondary)]">
            Period: <span className="font-medium text-[var(--text-primary)]">
              {generatePeriod(startYear, endYear, isPresent)}
            </span>
          </div>
        )}
      </div>

      {/* Hidden field */}
      <input type="hidden" {...register('period')} />

      <Input
        label="Title"
        required
        placeholder="Bachelor of Science in Computer Science"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        placeholder="Graduated with honors..."
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={!startYear || (!endYear && !isPresent)}>
          {initialData?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

