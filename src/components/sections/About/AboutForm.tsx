'use client';

import React, { useState } from 'react';
import { User, FileText, BarChart3, Save, X, Sparkles, Layers } from 'lucide-react';
import { ParagraphsInput } from './ParagraphsInput';
import { StatsInput } from './StatsInput';
import { AboutStatsDisplay } from './AboutStatsDisplay';
import { getRoleIcon, getRoleColor } from '@/lib/utils/aboutHelpers';
import { Button } from '@/components/ui/Button';
import type { AboutSection } from '@/types/about';
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

interface AboutFormProps {
    initialData?: AboutSection;
    onSubmit: (data: AboutSection) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * AboutForm - Unified add/edit form for about sections
 */
export function AboutForm({ initialData, onSubmit, onCancel, isLoading = false }: AboutFormProps) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState<AboutSection>({
        roleTitle: initialData?.roleTitle || '',
        paragraphs: initialData?.paragraphs || [''],
        stats: initialData?.stats || [{ label: '', value: '' }],
        orderIndex: initialData?.orderIndex || 0,
        ...(initialData?.id && { id: initialData.id }),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.roleTitle.trim()) {
            newErrors.roleTitle = 'Role title is required';
        }

        const validParagraphs = formData.paragraphs.filter(p => p.trim());
        if (validParagraphs.length === 0) {
            newErrors.paragraphs = 'At least one paragraph is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const cleanedData: AboutSection = {
            ...formData,
            paragraphs: formData.paragraphs.filter(p => p.trim()),
            stats: formData.stats.filter(s => s.label.trim() && s.value.trim()),
        };

        onSubmit(cleanedData);
    };

    const Icon = getRoleIcon(formData.roleTitle || 'default');
    const color = getRoleColor(formData.roleTitle || 'default');

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 pb-20">
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
                {/* Structural Identity */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Profile Details</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Set your primary role title</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div
                            className="w-20 h-20 rounded-[28px] flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/5 border border-white/10"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <Icon className="w-10 h-10" style={{ color }} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                Role Title <span className="text-[var(--error-500)]">*</span>
                            </label>
                            <div className="relative group/input">
                                <Sparkles size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--primary-500)] transition-colors" />
                                <input
                                    type="text"
                                    value={formData.roleTitle}
                                    onChange={(e) => {
                                        setFormData({ ...formData, roleTitle: e.target.value });
                                        if (errors.roleTitle) setErrors({ ...errors, roleTitle: '' });
                                    }}
                                    placeholder="e.g., Full Stack Architect"
                                    className={cn(
                                        'w-full pl-12 pr-5 py-4 rounded-2xl border transition-all premium-input text-lg font-bold',
                                        errors.roleTitle
                                            ? 'border-[var(--error-500)]'
                                            : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                                    )}
                                />
                            </div>
                            {errors.roleTitle && (
                                <p className="mt-1 text-[10px] font-bold text-[var(--error-500)] ml-2">{errors.roleTitle}</p>
                            )}
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] font-medium text-[var(--text-tertiary)] italic ml-2">
                        Icon is automatically selected based on your role title.
                    </p>
                </motion.section>

                {/* Narrative Architecture */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--info-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Bio Content</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Write your professional story</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ParagraphsInput
                            value={formData.paragraphs}
                            onChange={(paragraphs) => {
                                setFormData({ ...formData, paragraphs });
                                if (errors.paragraphs) setErrors({ ...errors, paragraphs: '' });
                            }}
                            error={errors.paragraphs}
                        />
                    </div>
                </motion.section>

                {/* Quantitative Metrics */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--accent-500)] to-transparent"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Key Stats</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Highlight your achievements with numbers</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <StatsInput
                            value={formData.stats}
                            onChange={(stats) => setFormData({ ...formData, stats })}
                            error={errors.stats}
                        />

                        {/* High-Impact Preview */}
                        {formData.stats.some(s => s.label && s.value) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-6 rounded-[32px] bg-white/[0.02] border border-white/5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Layers size={14} className="text-[var(--accent-500)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Live Preview</span>
                                </div>
                                <AboutStatsDisplay
                                    stats={formData.stats.filter(s => s.label.trim() && s.value.trim())}
                                />
                            </motion.div>
                        )}
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
                        className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95 flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <X size={14} />
                        Cancel
                    </button>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        className="px-12 py-4 rounded-2xl shadow-xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2 text-white"
                    >
                        {!isLoading && <Save size={14} />}
                        <span>{isEdit ? 'Save Changes' : 'Create Section'}</span>
                    </Button>
                </motion.div>
            </motion.div>
        </form >
    );
}
