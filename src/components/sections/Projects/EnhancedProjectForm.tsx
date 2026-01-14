'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { TechStackInput } from './TechStackInput';
import { StatusSelector } from './StatusSelector';
import { validateProjectTitle, validateShortDescription, validateUrl } from '@/lib/utils/projectHelpers';
import type { ProjectFormData } from '@/types/projects';
import { cn } from '@/lib/utils/cn';

// Form validation schema
const projectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
    shortDescription: z.string().min(1, 'Short description is required').max(200, 'Must be 200 characters or less'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    techStack: z.array(z.string()).min(1, 'Add at least one technology'),
    thumbnail: z.string().min(1, 'Thumbnail URL is required'),
    liveUrl: z.string().optional().refine((val) => !val || validateUrl(val) === null, 'Invalid URL'),
    githubUrl: z.string().optional().refine((val) => !val || validateUrl(val) === null, 'Invalid URL'),
    status: z.enum(['live', 'draft', 'development', 'archived']),
    featured: z.boolean(),
    isPublished: z.boolean(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().nullable(),
});

interface EnhancedProjectFormProps {
    initialData?: Partial<ProjectFormData>;
    onSubmit: (data: ProjectFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

import { motion } from 'framer-motion';
import {
    Info,
    Code2,
    Image as ImageIcon,
    Link as LinkIcon,
    Eye,
    Calendar,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

/**
 * EnhancedProjectForm - Main project form with sections and validation
 */
export function EnhancedProjectForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}: EnhancedProjectFormProps) {
    const [ongoing, setOngoing] = useState(!initialData?.endDate);
    const isEditMode = !!initialData;

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: initialData?.title || '',
            shortDescription: initialData?.shortDescription || '',
            description: initialData?.description || '',
            category: initialData?.category || 'web',
            techStack: initialData?.techStack || [],
            thumbnail: initialData?.thumbnail || '',
            liveUrl: initialData?.liveUrl || '',
            githubUrl: initialData?.githubUrl || '',
            status: initialData?.status || 'draft',
            featured: initialData?.featured || false,
            isPublished: initialData?.isPublished || false,
            startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
            endDate: initialData?.endDate || null,
        },
        mode: 'onChange'
    });

    const shortDescription = watch('shortDescription');
    const featured = watch('featured');
    const isPublished = watch('isPublished');

    const handleFormSubmit = (data: ProjectFormData) => {
        onSubmit({
            ...data,
            endDate: ongoing ? null : data.endDate
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-5xl mx-auto pb-20">
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
                {/* Basic Information */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent opacity-50"></div>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Core Essentials</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Fundamental project descriptors</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Title */}
                        <div className="space-y-1">
                            <Input
                                label="Project Title"
                                required
                                {...register('title')}
                                error={errors.title?.message}
                                placeholder="The formal designation of your masterpiece"
                                className="premium-input"
                            />
                        </div>

                        {/* Short Description */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                                Narrative Summary
                                <span className="text-[var(--danger)] ml-1">*</span>
                            </label>
                            <Textarea
                                {...register('shortDescription')}
                                rows={2}
                                maxLength={200}
                                placeholder="A brief, high-impact synopsis (1-2 sentences)"
                                className="premium-input min-h-[100px] resize-none"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic">
                                    This visual teaser appears in the identity cards.
                                </p>
                                <span className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                                    shortDescription.length > 180 ? "text-[var(--warning-600)] bg-[var(--warning-50)]" : "text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]"
                                )}>
                                    {shortDescription.length} / 200
                                </span>
                            </div>
                            {errors.shortDescription && (
                                <p className="text-xs font-bold text-[var(--error-500)] mt-1">{errors.shortDescription.message}</p>
                            )}
                        </div>

                        {/* Full Description */}
                        <div className="space-y-1">
                            <Textarea
                                label="Project Chronology"
                                required
                                {...register('description')}
                                rows={8}
                                error={errors.description?.message}
                                placeholder="Elucidate the technical journey, architectural decisions, and realized outcomes..."
                                className="premium-input min-h-[200px]"
                            />
                            <p className="text-[10px] font-medium text-[var(--text-tertiary)] mt-2">
                                Markdown syntax is interpreted for rich presentation.
                            </p>
                        </div>

                        {/* Category */}
                        <div className="max-w-md">
                            <Input
                                label="Taxonomy Category"
                                required
                                {...register('category')}
                                error={errors.category?.message}
                                placeholder="e.g., NEURAL ARCHITECTURE, WEB APPLICATION"
                                className="premium-input"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Tech Stack */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent-500)] to-transparent opacity-50"></div>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                            <Code2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Technological Matrix</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Integrated toolsets and frameworks</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Controller
                            name="techStack"
                            control={control}
                            render={({ field }) => (
                                <TechStackInput
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.techStack && (
                            <p className="text-sm font-bold text-[var(--error-500)] mt-1">{errors.techStack.message}</p>
                        )}
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Media */}
                    <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--info-500)] to-transparent opacity-50"></div>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Visual Identity</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Project imagery</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Asset URI"
                                required
                                {...register('thumbnail')}
                                error={errors.thumbnail?.message}
                                placeholder="https://cdn.archive.com/preview.webp"
                                className="premium-input"
                            />
                            <div className="aspect-video rounded-2xl bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
                                {watch('thumbnail') ? (
                                    <img src={watch('thumbnail')} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon size={32} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Preview Unavailable</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>

                    {/* Links */}
                    <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[32px] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--success-500)] to-transparent opacity-50"></div>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-[var(--success-500)]/10 text-[var(--success-500)]">
                                <LinkIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Access Points</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Global project endpoints</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="Live Deployment"
                                {...register('liveUrl')}
                                error={errors.liveUrl?.message}
                                placeholder="https://production.live"
                                className="premium-input"
                            />

                            <Input
                                label="Source Repository"
                                {...register('githubUrl')}
                                error={errors.githubUrl?.message}
                                placeholder="https://github.com/archive/repo"
                                className="premium-input"
                            />
                        </div>
                    </motion.section>
                </div>

                {/* Status & Timeline */}
                <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[32px] space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--warning-500)] to-transparent opacity-50"></div>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-[var(--warning-500)]/10 text-[var(--warning-500)]">
                            <Eye size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Lifecycle & Deployment</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Global visibility controls</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-4">
                                    Operational Status
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <StatusSelector
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid gap-4">
                                <motion.div whileHover={{ x: 5 }} className="group/toggle">
                                    <label className="flex items-center gap-4 p-4 rounded-2xl glass-panel bg-white/5 dark:bg-black/5 hover:border-[var(--warning-500)] transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('featured')}
                                            className="w-5 h-5 rounded-lg accent-[var(--warning-500)] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-black text-[var(--text-primary)] tracking-tight">Promote to Featured</div>
                                            <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Highlight as a flagship project</div>
                                        </div>
                                        {featured && (
                                            <Sparkles size={18} className="text-[var(--warning-500)] animate-pulse" />
                                        )}
                                    </label>
                                </motion.div>

                                <motion.div whileHover={{ x: 5 }} className="group/toggle">
                                    <label className="flex items-center gap-4 p-4 rounded-2xl glass-panel bg-white/5 dark:bg-black/5 hover:border-[var(--success-500)] transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('isPublished')}
                                            className="w-5 h-5 rounded-lg accent-[var(--success-500)] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-black text-[var(--text-primary)] tracking-tight">Publish Publicly</div>
                                            <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Available for public observation</div>
                                        </div>
                                        {isPublished && (
                                            <CheckCircle2 size={18} className="text-[var(--success-500)]" />
                                        )}
                                    </label>
                                </motion.div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar size={18} className="text-[var(--text-tertiary)]" />
                                <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Development Timeline</label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    type="date"
                                    label="Initiation Date"
                                    required
                                    {...register('startDate')}
                                    error={errors.startDate?.message}
                                    className="premium-input"
                                />

                                <div className="space-y-4">
                                    <Input
                                        type="date"
                                        label="Completion Date"
                                        {...register('endDate')}
                                        disabled={ongoing}
                                        error={errors.endDate?.message}
                                        className={cn("premium-input", ongoing && "opacity-50 grayscale")}
                                    />
                                    <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ongoing}
                                            onChange={(e) => setOngoing(e.target.checked)}
                                            className="w-4 h-4 rounded accent-[var(--primary-500)]"
                                        />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Active/Ongoing</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Actions */}
                <motion.div
                    variants={sectionVariants}
                    className="flex items-center justify-between p-8 glass-panel rounded-[32px] border-t-4 border-t-[var(--primary-500)]"
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95"
                    >
                        Discard Changes
                    </button>

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="px-12 py-4 rounded-2xl shadow-xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                isEditMode ? 'Authorize Update' : 'Initialize Project'
                            )}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </form>
    );
}
