'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { Building2, MapPin, Clock, FileText, Plus, Save, X, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { experienceSchema } from '@/lib/validations/schemas';
import { RolesAccordion } from './RolesAccordion';
import type { ExperienceEntry, ExperienceRole, EmploymentType } from '@/types';
import { cn } from '@/lib/utils/cn';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

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

  const calculateOverallPeriod = (rolesList: ExperienceRole[]): string => {
    if (rolesList.length === 0) return '';

    const validRoles = rolesList.filter(r => r.startDate);
    if (validRoles.length === 0) return '';

    const sortedRoles = [...validRoles].sort((a, b) => {
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
    if (roles.length === 0) return;

    const invalidRoles = roles.filter(
      (role) => !role.jobTitle.trim() || !role.startDate || !role.description.trim()
    );
    if (invalidRoles.length > 0) return;

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
    } as ExperienceEntry;
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
          <Form className="max-w-4xl mx-auto space-y-10 pb-20">
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
              {/* Organizational Core */}
              <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Organization Details</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Company and location details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                      Organization <span className="text-[var(--error-500)]">*</span>
                    </label>
                    <input
                      type="text"
                      value={values.organization}
                      onChange={(e) => setFieldValue('organization', e.target.value)}
                      placeholder="e.g., Tech Company"
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl border transition-all premium-input",
                        errors.organization ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--primary-500)]"
                      )}
                    />
                    {errors.organization && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.organization as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Location</label>
                    <div className="relative group/input">
                      <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                      <input
                        type="text"
                        value={values.location}
                        onChange={(e) => setFieldValue('location', e.target.value)}
                        placeholder="e.g., Virtual / Remote"
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input focus:border-[var(--primary-500)] text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Employment Type</label>
                    <div className="relative group/input">
                      <Clock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                      <select
                        value={values.employmentType}
                        onChange={(e) => setFieldValue('employmentType', e.target.value)}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input focus:border-[var(--primary-500)] appearance-none text-sm"
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
                    <div className="p-4 rounded-[28px] bg-[var(--primary-500)]/[0.03] border border-[var(--primary-500)]/10 flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/5">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Total Duration</span>
                        <span className="block text-sm font-bold text-[var(--primary-500)] tracking-tight">{overallPeriod}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Experience Summary */}
              <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--accent-500)] to-transparent"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Work Summary</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Brief overview of your role</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={values.summary}
                    onChange={(e) => setFieldValue('summary', e.target.value)}
                    placeholder="Provide a strategic overview of your impact at this organization..."
                    className="w-full px-5 py-4 rounded-[32px] border border-[var(--border-subtle)] transition-all premium-input min-h-[140px] resize-none focus:border-[var(--accent-500)] text-sm"
                    rows={4}
                  />
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] ml-2">Describe your overall experience at this company.</p>
                </div>
              </motion.section>

              {/* Roles Architecture */}
              <motion.section variants={sectionVariants} className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Roles and Responsibilities</h3>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddRole}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[var(--primary-500)]/20"
                  >
                    <Plus size={16} />
                    Add Role
                  </motion.button>
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
                  disabled={
                    !values.organization ||
                    roles.length === 0 ||
                    roles.some((r) => !r.jobTitle.trim() || !r.startDate || !r.description.trim())
                  }
                >
                  {!isSubmitting && !isLoading && <Save size={14} />}
                  <span>{initialData?.id ? 'Save Changes' : 'Create Experience'}</span>
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        );
      }}
    </Formik>
  );
}
