'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@/components/ui/Button';
import { FormSection } from '@/components/ui/FormSection';
import { experienceSchema } from '@/lib/validations/schemas';
import { RolesAccordion } from './RolesAccordion';
import type { ExperienceEntry, ExperienceRole, EmploymentType } from '@/types';

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
      // Ensure all roles have isCurrent derived from endDate
      return initialData.roles.map(role => ({
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

  // Calculate overall period from roles
  const calculateOverallPeriod = (rolesList: ExperienceRole[]): string => {
    if (rolesList.length === 0) return '';

    const sortedRoles = [...rolesList].sort((a, b) => {
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });

    const firstRole = sortedRoles[0];
    const lastRole = sortedRoles.find(r => r.isCurrent) || sortedRoles[sortedRoles.length - 1];

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [year, month] = dateStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      id: `role-${roles.length}`,
      jobTitle: '',
      startDate: newStartDate,
      endDate: null,
      isCurrent: false,
      description: '',
      orderIndex: roles.length,
    };

    setRoles((prev) => [...prev, newRole]);
    setExpandedRoleId(newRole.id); // Collapse previous, expand new
  };

  const handleRoleChange = (roleId: string, updatedRole: ExperienceRole) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) {
          // If another role is being marked as current, unmark others
          if (updatedRole.isCurrent && role.isCurrent) {
            const defaultEnd = role.endDate || new Date().toISOString().slice(0, 7);
            return { ...role, isCurrent: false, endDate: defaultEnd };
          }
          return role;
        }
        // Ensure isCurrent and endDate are in sync
        const syncedRole = {
          ...updatedRole,
          isCurrent: updatedRole.endDate === null,
        };
        return syncedRole;
      })
    );
  };

  const handleRoleRemove = (roleId: string) => {
    if (roles.length <= 1) return;
    const newRoles = roles.filter((r) => r.id !== roleId);
    const reindexedRoles = newRoles.map((role, i) => ({ ...role, orderIndex: i }));
    setRoles(reindexedRoles);

    // If removed role was expanded, expand first role
    if (expandedRoleId === roleId) {
      setExpandedRoleId(reindexedRoles[0]?.id ?? null);
    }
  };

  const handleExpand = (roleId: string) => {
    setExpandedRoleId(roleId);
  };

  const handleCollapse = () => {
    setExpandedRoleId(null);
  };

  const initialValues = {
    organization: initialData?.organization || '',
    location: initialData?.location || '',
    employmentType: (initialData?.employmentType || '') as EmploymentType | '',
    summary: initialData?.summary || '',
  };

  const handleSubmit = async (values: any) => {
    // Validate roles manually
    if (roles.length === 0) {
      return;
    }

    const invalidRoles = roles.filter(
      (role) => !role.jobTitle.trim() || !role.startDate || !role.description.trim()
    );
    if (invalidRoles.length > 0) {
      return;
    }

    // Check for multiple current roles
    const currentRoles = roles.filter((r) => r.isCurrent);
    if (currentRoles.length > 1) {
      // Warn but allow - we'll take the first one
      console.warn('Multiple roles marked as current, using first one');
    }

    // Sort roles by start date and re-index
    const sortedRoles = [...roles]
      .sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        if (a.startDate > b.startDate) return 1;
        return 0;
      })
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
    };
    await onSubmit(experienceData);
  };

  const overallPeriod = calculateOverallPeriod(roles);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={experienceSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors, values, setFieldValue }) => {
        return (
          <Form>
            <FormSection
              title="Experience Details"
              description="Enter your work experience. You can add multiple roles if you've been promoted or changed positions within the same organization."
            >
              {/* Organization Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="form-label">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={values.organization}
                    onChange={(e) => setFieldValue('organization', e.target.value)}
                    placeholder="e.g., Tech Corp Inc."
                    className="form-input"
                    required
                  />
                  {errors.organization && (
                    <p className="form-error">{errors.organization as string}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={values.location}
                    onChange={(e) => setFieldValue('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Employment Type</label>
                <select
                  value={values.employmentType}
                  onChange={(e) => setFieldValue('employmentType', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select employment type</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Summary</label>
                <textarea
                  value={values.summary}
                  onChange={(e) => setFieldValue('summary', e.target.value)}
                  placeholder="Optional organization-level summary or overview..."
                  className="form-textarea"
                  rows={3}
                />
                <p className="form-hint text-xs mt-1">
                  Brief overview of your overall experience at this organization
                </p>
              </div>

              {/* Overall Period Preview */}
              {overallPeriod && (
                <div className="overall-period-preview">
                  <div className="text-sm text-[var(--text-secondary)] mb-1">
                    Overall Tenure at {values.organization || 'this organization'}
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    {overallPeriod}
                  </div>
                </div>
              )}

              {/* Roles Accordion */}
              <RolesAccordion
                roles={roles}
                expandedRoleId={expandedRoleId}
                onExpand={handleExpand}
                onCollapse={handleCollapse}
                onRoleChange={handleRoleChange}
                onRoleRemove={handleRoleRemove}
                onAddRole={handleAddRole}
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
                disabled={
                  !values.organization ||
                  roles.length === 0 ||
                  roles.some(
                    (r) =>
                      !r.jobTitle.trim() ||
                      !r.startDate ||
                      !r.description.trim() ||
                      (r.endDate && r.endDate < r.startDate)
                  )
                }
              >
                {initialData?.id ? 'Update' : 'Create'} Experience Entry
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
