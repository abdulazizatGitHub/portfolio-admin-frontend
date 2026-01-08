'use client';

import { useState, useEffect, useId } from 'react';
import { ExperienceRole } from '@/types';

interface RoleFormFieldsProps {
  role: ExperienceRole;
  onChange: (role: ExperienceRole) => void;
  hasOtherCurrent: boolean; // Whether another role is marked as current
}

export function RoleFormFields({ role, onChange, hasOtherCurrent }: RoleFormFieldsProps) {
  const checkboxId = useId();
  const [startDate, setStartDate] = useState(role.startDate || '');
  const [endDate, setEndDate] = useState(role.endDate || '');
  const [isCurrent, setIsCurrent] = useState(role.isCurrent);

  useEffect(() => {
    setStartDate(role.startDate || '');
    setEndDate(role.endDate || '');
    setIsCurrent(role.isCurrent);
  }, [role]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onChange({ ...role, startDate: value });
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onChange({ ...role, endDate: value || null, isCurrent: false });
  };

  const handleIsCurrentChange = (checked: boolean) => {
    setIsCurrent(checked);
    if (checked) {
      setEndDate('');
      onChange({ ...role, endDate: null, isCurrent: true });
    } else {
      // Set end date to current month or next role's start date
      const defaultEnd = new Date().toISOString().slice(0, 7);
      setEndDate(defaultEnd);
      onChange({ ...role, endDate: defaultEnd, isCurrent: false });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  const getPeriodDisplay = () => {
    if (!startDate) return '';
    if (isCurrent) return `${formatDate(startDate)} – Present`;
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const hasDateError = startDate && endDate && endDate < startDate;

  return (
    <div className="role-form-fields">
      <div className="form-field">
        <label className="form-label">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={role.jobTitle}
          onChange={(e) => onChange({ ...role, jobTitle: e.target.value })}
          placeholder="e.g., Senior Full Stack Developer"
          className="form-input"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-field">
          <label className="form-label">
            Start Date (Month & Year) <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            End Date (Month & Year) {!isCurrent && <span className="text-red-500">*</span>}
          </label>
          <input
            type="month"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="form-input"
            disabled={isCurrent}
            required={!isCurrent}
            min={startDate || undefined}
          />
          {hasDateError && (
            <p className="form-error text-xs mt-1">
              End date must be after start date
            </p>
          )}
        </div>
      </div>

      <div className="form-checkbox-wrapper">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => handleIsCurrentChange(e.target.checked)}
          className="form-checkbox"
          id={checkboxId}
          disabled={hasOtherCurrent}
        />
        <label htmlFor={checkboxId} className="text-sm text-[var(--text-primary)] cursor-pointer">
          This is my current role
        </label>
        {hasOtherCurrent && isCurrent && (
          <p className="form-error text-xs mt-1">
            Only one role can be marked as current
          </p>
        )}
      </div>

      {startDate && (
        <div className="text-sm text-[var(--text-secondary)]">
          Period: <span className="font-medium text-[var(--text-primary)]">
            {getPeriodDisplay()}
          </span>
        </div>
      )}

      <div className="form-field">
        <label className="form-label">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={role.description}
          onChange={(e) => onChange({ ...role, description: e.target.value })}
          placeholder="Describe your responsibilities and achievements in this role..."
          className="form-textarea"
          rows={4}
          required
        />
        <p className="form-hint text-xs mt-1">
          Use bullet points or paragraphs to describe your role
        </p>
      </div>
    </div>
  );
}

