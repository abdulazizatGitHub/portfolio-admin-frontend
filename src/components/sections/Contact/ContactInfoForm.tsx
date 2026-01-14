'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Tag, Link as LinkIcon, Save, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contactInfoSchema } from '@/lib/validations/schemas';
import type { ContactInfoItem } from '@/types';
import { cn } from '@/lib/utils/cn';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

interface ContactInfoFormProps {
  initialData?: Partial<ContactInfoItem>;
  onSubmit: (data: ContactInfoItem) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactInfoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ContactInfoFormProps) {
  const initialValues: Partial<ContactInfoItem> = {
    type: initialData?.type || 'email',
    label: initialData?.label || '',
    value: initialData?.value || '',
    href: initialData?.href || '',
  };

  const handleSubmit = async (values: any) => {
    const contactData: ContactInfoItem = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    } as ContactInfoItem;
    await onSubmit(contactData);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'location': return <MapPin size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={contactInfoSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors, values, setFieldValue }) => (
        <Form className="max-w-2xl mx-auto space-y-10 pb-10">
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
            {/* Communication Node */}
            <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                  {getTypeIcon(values.type || 'email')}
                </div>
                <div>
                  <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Contact Information</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Update your contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Contact Type</label>
                  <div className="relative group/input">
                    <Tag size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                    <select
                      value={values.type}
                      onChange={(e) => setFieldValue('type', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input appearance-none text-sm focus:border-[var(--primary-500)]"
                    >
                      <option value="email">Email Address</option>
                      <option value="phone">Phone Number</option>
                      <option value="location">Location / Address</option>
                    </select>
                  </div>
                </div>

                {/* Label & Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Label <span className="text-[var(--error-500)]">*</span></label>
                    <input
                      type="text"
                      value={values.label}
                      onChange={(e) => setFieldValue('label', e.target.value)}
                      placeholder="e.g., Primary Email"
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl border transition-all premium-input text-sm",
                        errors.label ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--primary-500)]"
                      )}
                    />
                    {errors.label && <p className="text-[10px] font-bold text-[var(--error-500)] ml-2">{errors.label as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Contact Value <span className="text-[var(--error-500)]">*</span></label>
                    <input
                      type="text"
                      value={values.value}
                      onChange={(e) => setFieldValue('value', e.target.value)}
                      placeholder="e.g., contact@dev.com"
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl border transition-all premium-input text-sm",
                        errors.value ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--primary-500)]"
                      )}
                    />
                    {errors.value && <p className="text-[10px] font-bold text-[var(--error-500)] ml-2">{errors.value as string}</p>}
                  </div>
                </div>

                {/* Href */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Action Link</label>
                  <div className="relative group/input">
                    <LinkIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                    <input
                      type="text"
                      value={values.href}
                      onChange={(e) => setFieldValue('href', e.target.value)}
                      placeholder="e.g., mailto:contact@dev.com"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-subtle)] transition-all premium-input text-sm focus:border-[var(--primary-500)]"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic ml-2 leading-relaxed">Optional URL for direct interaction (e.g., mailto:someone@example.com)</p>
                </div>
              </div>
            </motion.section>

            {/* Actions */}
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
                disabled={!values.label || !values.value}
              >
                {!isSubmitting && !isLoading && <Save size={14} />}
                <span>{initialData?.id ? 'Update Contact Info' : 'Save Contact Info'}</span>
              </Button>
            </motion.div>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
}
