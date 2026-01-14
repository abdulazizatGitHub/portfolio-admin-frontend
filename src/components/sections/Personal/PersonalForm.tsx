'use client';

import React, { useState, useRef } from 'react';
import { User, FileText, Globe, Save, X, UploadCloud, Trash2, CheckCircle2, Briefcase } from 'lucide-react';
import { RolesInput } from './RolesInput';
import { validateProfile } from '@/lib/utils/personalHelpers';
import { Button } from '@/components/ui/Button';
import type { PersonalProfile } from '@/types/personal';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

interface PersonalFormProps {
    initialData?: PersonalProfile;
    onSubmit: (data: PersonalProfile) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * PersonalForm - Unified add/edit form for personal profiles
 */
export function PersonalForm({ initialData, onSubmit, onCancel, isLoading = false }: PersonalFormProps) {
    const isEdit = !!initialData;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PersonalProfile>({
        name: initialData?.name || '',
        titlePrefix: initialData?.titlePrefix || '',
        description: initialData?.description || '',
        roles: initialData?.roles || [],
        cvDownloadName: initialData?.cvDownloadName || 'Resume.pdf',
        cvFileName: initialData?.cvFileName || '',
        cvFile: initialData?.cvFile || '',
        isDefault: initialData?.isDefault || false,
        ...(initialData?.id && { id: initialData.id }),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    cvFile: reader.result as string,
                    cvFileName: file.name,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setFormData({
            ...formData,
            cvFile: '',
            cvFileName: '',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateProfile(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
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
                {/* Identity Cluster */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Identity Fundamentals</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Core personal descriptors</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                Full Designation <span className="text-[var(--error-500)]">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: '' });
                                }}
                                placeholder="Abdul Hannan"
                                className={cn(
                                    'w-full px-5 py-4 rounded-2xl border transition-all premium-input',
                                    errors.name ? 'border-[var(--error-500)]' : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                                )}
                            />
                            {errors.name && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                Introduction Hook <span className="text-[var(--error-500)]">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.titlePrefix}
                                onChange={(e) => {
                                    setFormData({ ...formData, titlePrefix: e.target.value });
                                    if (errors.titlePrefix) setErrors({ ...errors, titlePrefix: '' });
                                }}
                                placeholder="Hi, I'm"
                                className={cn(
                                    'w-full px-5 py-4 rounded-2xl border transition-all premium-input',
                                    errors.titlePrefix ? 'border-[var(--error-500)]' : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                                )}
                            />
                            {errors.titlePrefix && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.titlePrefix}</p>}
                        </div>
                    </div>
                </motion.section>

                {/* Expertise Spectrum */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--accent-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Expertise Spectrum</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Professional focal points</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <RolesInput
                            value={formData.roles}
                            onChange={(roles) => {
                                setFormData({ ...formData, roles });
                                if (errors.roles) setErrors({ ...errors, roles: '' });
                            }}
                            error={errors.roles}
                        />
                    </div>
                </motion.section>

                {/* Professional Narrative */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--success-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--success-500)]/10 text-[var(--success-500)]">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Professional Narrative</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Global identity synopsis</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value });
                                if (errors.description) setErrors({ ...errors, description: '' });
                            }}
                            placeholder="Narrate your professional odyssey..."
                            rows={8}
                            className={cn(
                                'w-full px-5 py-4 rounded-[32px] border transition-all resize-none premium-input min-h-[200px]',
                                errors.description ? 'border-[var(--error-500)]' : 'border-[var(--border-subtle)] focus:border-[var(--success-500)]'
                            )}
                        />
                        {errors.description && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.description}</p>}
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* CV Artifact */}
                    <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--info-500)] to-transparent"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                                <UploadCloud size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Credential Artifact</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">CV transmission</p>
                            </div>
                        </div>

                        <div className={cn(
                            'relative border-2 border-dashed rounded-[32px] p-10 transition-all text-center group/upload',
                            formData.cvFile ? 'bg-[var(--info-500)]/5 border-[var(--info-500)]/30' : 'bg-white/5 dark:bg-black/5 border-[var(--border-subtle)] hover:border-[var(--info-500)]/50'
                        )}>
                            {formData.cvFile ? (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 rounded-[28px] bg-[var(--info-500)] text-white flex items-center justify-center mx-auto shadow-xl shadow-[var(--info-500)]/20">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-[900] text-[var(--text-primary)] tracking-tight truncate px-4">{formData.cvFileName}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--success-600)] mt-1">Verified Payload</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--error-500)] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--error-500)]/20"
                                    >
                                        <Trash2 size={14} />
                                        Purge Artifact
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] flex items-center justify-center mx-auto group-hover/upload:scale-110 group-hover/upload:bg-[var(--info-500)]/10 group-hover/upload:text-[var(--info-500)] transition-all">
                                        <UploadCloud size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Initialize Upload</p>
                                        <p className="text-[10px] font-medium text-[var(--text-tertiary)] mt-1">PDF / DOCX compatible</p>
                                    </div>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </motion.section>

                    {/* Distribution Controls */}
                    <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--warning-500)] to-transparent"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-[var(--warning-500)]/10 text-[var(--warning-500)]">
                                <Save size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Access Control</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Global distribution</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                    Download Designation
                                </label>
                                <input
                                    type="text"
                                    value={formData.cvDownloadName}
                                    onChange={(e) => setFormData({ ...formData, cvDownloadName: e.target.value })}
                                    placeholder="e.g. John_Doe_Resume.pdf"
                                    className="w-full px-5 py-4 bg-white/5 dark:bg-black/5 border border-[var(--border-subtle)] rounded-2xl text-sm premium-input"
                                />
                                <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic ml-1 italic leading-relaxed">
                                    Final filename upon retrieval.
                                </p>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-4 p-5 rounded-3xl glass-panel bg-white/5 dark:bg-black/5 hover:border-[var(--primary-500)] transition-all cursor-pointer group/toggle">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        disabled={initialData?.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-5 h-5 rounded-lg accent-[var(--primary-500)] cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <span className="block text-sm font-[900] text-[var(--text-primary)] tracking-tight">Primary Identity</span>
                                        <span className="block text-[10px] font-medium text-[var(--text-tertiary)]">Designated global identity nexus.</span>
                                    </div>
                                    {formData.isDefault && <CheckCircle2 size={18} className="text-[var(--primary-500)] animate-pulse" />}
                                </label>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Form Actions */}
                <motion.div
                    variants={sectionVariants}
                    className="flex items-center justify-between p-8 glass-panel rounded-[40px] border-t-4 border-t-[var(--primary-500)]"
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95 flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <X size={14} />
                        Abort
                    </button>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        className="px-12 py-4 rounded-2xl shadow-xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
                    >
                        {!isLoading && <Save size={14} />}
                        <span>{isEdit ? 'Authorize Refinement' : 'Finalize Identity'}</span>
                    </Button>
                </motion.div>
            </motion.div>
        </form>
    );
}
