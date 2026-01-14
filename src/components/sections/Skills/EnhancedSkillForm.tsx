'use client';

import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { SkillNameInput } from './SkillNameInput';
import { CategorySelector } from './CategorySelector';
import { ProficiencyControl } from './ProficiencyControl';
import { SkillConfidenceIndicator } from './SkillConfidenceIndicator';
import { OptionalContextSection } from './OptionalContextSection';
import { PortfolioPreviewHint } from './PortfolioPreviewHint';
import {
    normalizeSkillName,
    calculateConfidence,
    validateSkillName
} from '@/lib/utils/skillHelpers';
import type { SkillFormData } from '@/types/skills';
import { motion } from 'framer-motion';

// Enhanced validation schema with custom validations
const enhancedSkillSchema = z.object({
    name: z.string()
        .min(1, 'Skill name is required')
        .max(50, 'Skill name must be 50 characters or less')
        .refine(
            (val) => validateSkillName(val) === null,
            (val) => ({ message: validateSkillName(val) || 'Invalid skill name' })
        )
        .transform(normalizeSkillName),
    category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'soft', 'technical', 'ai'], {
        errorMap: () => ({ message: 'Please select a category' })
    }),
    level: z.number().min(0).max(100),
    context: z.string().max(200, 'Context must be 200 characters or less').optional(),
});

type EnhancedSkillFormData = z.infer<typeof enhancedSkillSchema>;

interface EnhancedSkillFormProps {
    initialData?: Partial<SkillFormData>;
    existingSkills?: string[];
    onSubmit: (data: SkillFormData) => void | Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

/**
 * EnhancedSkillForm - Main form component orchestrating all enhanced skill input components
 * Provides intelligent skill entry with semantic proficiency levels and confidence indicators
 */
export function EnhancedSkillForm({
    initialData,
    existingSkills = [],
    onSubmit,
    onCancel,
    isLoading = false
}: EnhancedSkillFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<EnhancedSkillFormData>({
        resolver: zodResolver(enhancedSkillSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            category: initialData?.category || 'frontend',
            level: initialData?.level || 50,
            context: initialData?.context || '',
        },
    });

    // Watch form values for derived state
    const name = watch('name');
    const category = watch('category');
    const level = watch('level');
    const context = watch('context');

    // Calculate confidence level based on proficiency and context
    const confidence = useMemo(() => {
        return calculateConfidence(level, !!context && context.length > 10);
    }, [level, context]);

    // Handle form submission
    const onSubmitForm = (data: EnhancedSkillFormData) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-2xl mx-auto space-y-10 pb-10">
            <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Skill Identity Section */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <SkillNameInput
                                value={field.value}
                                onChange={field.onChange}
                                existingSkills={existingSkills}
                                error={errors.name?.message}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <CategorySelector
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.category?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </motion.div>

                {/* Proficiency Section */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[var(--accent-500)] to-transparent"></div>

                    <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                            <ProficiencyControl
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.level?.message}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <div className="pt-2">
                        <SkillConfidenceIndicator confidence={confidence} />
                    </div>
                </motion.div>

                {/* Contextual Intelligence */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[32px] space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[var(--info-500)] to-transparent"></div>

                    <Controller
                        name="context"
                        control={control}
                        render={({ field }) => (
                            <OptionalContextSection
                                value={field.value || ''}
                                onChange={field.onChange}
                                disabled={isLoading}
                            />
                        )}
                    />
                </motion.div>

                {/* Visualization Preview */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[32px] bg-[var(--bg-tertiary)]/30 border-dashed border-2 border-[var(--border-subtle)]">
                    <PortfolioPreviewHint
                        skillName={name}
                        category={category}
                        level={level}
                    />
                </motion.div>

                {/* Actions */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between gap-4 pt-4"
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95"
                    >
                        Abort Operation
                    </button>

                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}
                        loading={isLoading}
                        className="px-12 py-4 rounded-2xl shadow-xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                        {initialData?.name ? 'Authorize Update' : 'Initialize Acquisition'}
                    </Button>
                </motion.div>
            </motion.div>
        </form>
    );
}
