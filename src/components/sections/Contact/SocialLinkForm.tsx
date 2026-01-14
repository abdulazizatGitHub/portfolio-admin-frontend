'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { Share2, Globe, Link as LinkIcon, Save, X, Github, Linkedin, Twitter, Youtube, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { socialLinkSchema } from '@/lib/validations/schemas';
import type { SocialLink } from '@/types';
import { cn } from '@/lib/utils/cn';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

interface SocialLinkFormProps {
  initialData?: Partial<SocialLink>;
  onSubmit: (data: SocialLink) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SocialLinkForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SocialLinkFormProps) {
  const initialValues: Partial<SocialLink> = {
    platform: initialData?.platform || '',
    url: initialData?.url || '',
  };

  const handleSubmit = async (values: any) => {
    const socialData: SocialLink = {
      ...initialData,
      ...values,
      orderIndex: initialData?.orderIndex ?? 0,
    } as SocialLink;
    await onSubmit(socialData);
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />;
    if (p.includes('youtube')) return <Youtube size={20} />;
    if (p.includes('instagram')) return <Instagram size={20} />;
    if (p.includes('facebook')) return <Facebook size={20} />;
    return <Globe size={20} />;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={socialLinkSchema}
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
            {/* Social Nexus */}
            <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--info-500)] to-transparent"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                  {getPlatformIcon(values.platform || '')}
                </div>
                <div>
                  <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Social Media Link</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Update your social media link</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Platform Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Platform Name <span className="text-[var(--error-500)]">*</span></label>
                  <div className="relative group/input">
                    <Share2 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--info-500)] transition-colors" />
                    <input
                      type="text"
                      value={values.platform}
                      onChange={(e) => setFieldValue('platform', e.target.value)}
                      placeholder="e.g., GitHub, LinkedIn, BlueSky"
                      className={cn(
                        "w-full pl-12 pr-5 py-4 rounded-2xl border transition-all premium-input text-sm",
                        errors.platform ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--info-500)]"
                      )}
                    />
                  </div>
                  {errors.platform && <p className="text-[10px] font-bold text-[var(--error-500)] ml-2">{errors.platform as string}</p>}
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Social Link URL <span className="text-[var(--error-500)]">*</span></label>
                  <div className="relative group/input">
                    <LinkIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--info-500)] transition-colors" />
                    <input
                      type="url"
                      value={values.url}
                      onChange={(e) => setFieldValue('url', e.target.value)}
                      placeholder="https://..."
                      className={cn(
                        "w-full pl-12 pr-5 py-4 rounded-2xl border transition-all premium-input text-sm",
                        errors.url ? "border-[var(--error-500)]" : "border-[var(--border-subtle)] focus:border-[var(--info-500)]"
                      )}
                    />
                  </div>
                  {errors.url && <p className="text-[10px] font-bold text-[var(--error-500)] ml-2">{errors.url as string}</p>}
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic ml-2 leading-relaxed">URL to your social profile.</p>
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
                disabled={!values.platform || !values.url}
              >
                {!isSubmitting && !isLoading && <Save size={14} />}
                <span>{initialData?.id ? 'Update Social Link' : 'Save Social Link'}</span>
              </Button>
            </motion.div>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
}
