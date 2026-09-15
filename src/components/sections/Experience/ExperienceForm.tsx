'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  MapPin,
  Clock,
  FileText,
  Plus,
  Save,
  X,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { experienceSchema } from '@/lib/validations/schemas';
import { RolesAccordion } from './RolesAccordion';
import type { ExperienceEntry, ExperienceRole, EmploymentType } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ExperienceFormProps {
  initialData?: Partial<ExperienceEntry>;
  onSubmit: (data: ExperienceEntry) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExperienceFormProps) {
  const [roles, setRoles] = useState<ExperienceRole[]>(() => {
    if (initialData?.roles && initialData.roles.length > 0) {
      return initialData.roles.map((role) => ({
        ...role,
        isCurrent: role.isCurrent !== undefined ? role.isCurrent : role.endDate === null,
      }));
    }
    return [
      {
        id: 'role-initial-0',
        jobTitle: '',
        startDate: '',
        endDate: null,
        isCurrent: false,
        description: '',
        orderIndex: 0,
      },
    ];
  });

  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(() => {
    return roles[0]?.id ?? null;
  });

  const calculateOverallPeriod = (rolesList: ExperienceRole[]): string => {
    if (rolesList.length === 0) return '';
    const validRoles = rolesList.filter((r) => r.startDate);
    if (validRoles.length === 0) return '';

    const sortedRoles = [...validRoles].sort((a, b) => {
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });

    const firstRole = sortedRoles[0];
    const lastRole = sortedRoles.find((r) => r.isCurrent) || sortedRoles[sortedRoles.length - 1];

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

    const start = formatDate(firstRole.startDate);
    const end = lastRole.isCurrent || !lastRole.endDate ? 'Present' : formatDate(lastRole.endDate!);
    return `${start} – ${end}`;
  };

  const handleAddRole = () => {
    const lastRole = roles[roles.length - 1];
    const newStartDate = lastRole?.endDate || new Date().toISOString().slice(0, 7);

    const newRole: ExperienceRole = {
      id: `role-${Date.now()}`,
      jobTitle: '',
      startDate: newStartDate,
      endDate: null,
      isCurrent: false,
      description: '',
      orderIndex: roles.length,
    };

    setRoles((prev) => [...prev, newRole]);
    setExpandedRoleId(newRole.id);
  };

  const handleRoleChange = (roleId: string, updatedRole: ExperienceRole) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) {
          if (updatedRole.isCurrent && role.isCurrent) {
            const defaultEnd = role.endDate || new Date().toISOString().slice(0, 7);
            return { ...role, isCurrent: false, endDate: defaultEnd };
          }
          return role;
        }
        return updatedRole;
      })
    );
  };

  const handleRoleRemove = (roleId: string) => {
    if (roles.length <= 1) return;
    const newRoles = roles.filter((r) => r.id !== roleId);
    const reindexedRoles = newRoles.map((role, i) => ({ ...role, orderIndex: i }));
    setRoles(reindexedRoles);
    if (expandedRoleId === roleId) {
      setExpandedRoleId(reindexedRoles[0]?.id ?? null);
    }
  };

  const handleExpand = (roleId: string) => setExpandedRoleId(roleId);
  const handleCollapse = () => setExpandedRoleId(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      organization: initialData?.organization || '',
      location: initialData?.location || '',
      employmentType: (initialData?.employmentType || '') as EmploymentType | '',
      summary: initialData?.summary || '',
    },
  });

  const values = watch();

  const handleFormSubmit = async (values: any) => {
    if (roles.length === 0) return;
    const sortedRoles = [...roles]
      .sort((a, b) => (a.startDate < b.startDate ? -1 : 1))
      .map((role, index) => ({ ...role, orderIndex: index }));

    const overallPeriod = calculateOverallPeriod(sortedRoles);
    const experienceData: ExperienceEntry = {
      ...initialData,
      organization: values.organization,
      location: values.location || undefined,
      employmentType: (values.employmentType || undefined) as EmploymentType | undefined,
      summary: values.summary || undefined,
      roles: sortedRoles,
      overallPeriod,
      orderIndex: initialData?.orderIndex ?? 0,
    } as ExperienceEntry;
    await onSubmit(experienceData);
  };

  const overallPeriod = calculateOverallPeriod(roles);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Organization Details Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Organization Details
            </h3>
            <p className="text-sm text-[var(--text-tertiary)]">Company name and location</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('organization')}
              placeholder="e.g. Google"
              className={cn(
                'w-full px-4 py-3 rounded-lg border bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors',
                errors.organization
                  ? 'border-red-500'
                  : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
              )}
            />
            {errors.organization && (
              <p className="text-xs text-red-500">{errors.organization.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Location</label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. Remote / New York"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Employment Type
            </label>
            <div className="relative">
              <Clock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <select
                {...register('employmentType')}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] appearance-none transition-colors"
              >
                <option value="">Select Type</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {overallPeriod && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
              <Calendar size={18} className="text-[var(--primary-500)]" />
              <div>
                <span className="block text-xs text-[var(--text-tertiary)]">Total Duration</span>
                <span className="block text-sm font-semibold text-[var(--text-primary)]">
                  {overallPeriod}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Work Summary Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Work Summary</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Brief overview of your time here</p>
          </div>
        </div>

        <textarea
          {...register('summary')}
          placeholder="Provide a brief overview of your overall impact and achievements..."
          className="w-full px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:border-[var(--primary-500)] transition-colors min-h-[120px] resize-none"
          rows={4}
        />
      </section>

      {/* Roles Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Briefcase size={22} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Roles & Responsibilities
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddRole}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-500)] text-white text-sm font-medium hover:bg-[var(--primary-600)] transition-colors"
          >
            <Plus size={16} />
            Add Role
          </button>
        </div>

        <RolesAccordion
          roles={roles}
          expandedRoleId={expandedRoleId}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          onRoleChange={handleRoleChange}
          onRoleRemove={handleRoleRemove}
          onAddRole={handleAddRole}
        />
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2"
        >
          <X size={16} />
          Cancel
        </button>
        <Button
          type="submit"
          loading={isSubmitting || isLoading}
          className="px-6 py-2.5 flex items-center gap-2"
          disabled={
            !values.organization ||
            roles.length === 0 ||
            roles.some((r) => !r.jobTitle.trim() || !r.startDate || !r.description.trim())
          }
        >
          {!isSubmitting && !isLoading && <Save size={16} />}
          {initialData?.id ? 'Save Changes' : 'Create Experience'}
        </Button>
      </div>
    </form>
  );
}
