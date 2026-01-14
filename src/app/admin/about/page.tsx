'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, Sparkles, Zap, Info, Layers, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAboutContent } from '@/lib/hooks';
import { AboutCard } from '@/components/sections/About/AboutCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { sortAboutSections } from '@/lib/utils/aboutHelpers';
import type { AboutSection } from '@/types';
import { cn } from '@/lib/utils/cn';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function AboutPage() {
    const router = useRouter();
    const { data: initialData, isLoading } = useAboutContent();
    const { success, error: showError } = useToast();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<AboutSection | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Derive sections from initial data
    const sections = initialData
        ? sortAboutSections(Array.isArray(initialData) ? initialData : [initialData])
        : [];

    const handleEdit = (section: AboutSection) => {
        router.push(`/admin/about/form?id=${section.id}`);
    };

    const handleDeleteClick = (section: AboutSection) => {
        setItemToDelete(section);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            // In a real app, we would call a mutation here
            // For now, we update the local view if we had local state, but since we derive from initialData,
            // we'd rely on query invalidation. For this mock, we can just show success.
            success('About section deleted successfully');
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            showError('Failed to delete about section');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Page Header Architecture */}
            <PageHeader
                title="About Me"
                description="Manage your professional bio and personal overview."
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'About' },
                ]}
                actions={
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="primary"
                            onClick={() => router.push('/admin/about/form')}
                            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-bold uppercase tracking-widest px-8 rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 border-0 group"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Bio Section
                        </Button>
                    </motion.div>
                }
            />

            <div className="relative min-h-[400px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <LoadingSpinner size="lg" className="text-[var(--primary-500)]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Loading Content</span>
                        </div>
                    </div>
                ) : sections.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 px-6 rounded-[40px] glass-panel border-2 border-dashed border-white/5"
                    >
                        <div className="relative mb-8">
                            <div className="w-40 h-40 rounded-full border border-[var(--primary-500)]/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-[35px] bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center text-white shadow-2xl">
                                    <User size={40} />
                                </div>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--primary-500)]">
                                <Sparkles size={20} />
                            </div>
                        </div>

                        <div className="text-center max-w-sm space-y-4">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                                No Bio Content Found
                            </h3>
                            <p className="text-sm font-medium text-[var(--text-tertiary)] leading-relaxed">
                                You haven't added any bio sections yet. Create a profile section to help people get to know you.
                            </p>
                            <div className="pt-6">
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/admin/about/form')}
                                    className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-black uppercase tracking-widest px-10 py-6 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Bio Section
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {sections.map((section, index) => (
                            section && (
                                <motion.div key={section.id || index} variants={itemVariants}>
                                    <AboutCard
                                        section={section}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteClick}
                                        isPrimary={index === 0}
                                    />
                                </motion.div>
                            )
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Meta Indicators */}
            {!isLoading && sections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-6 px-8 py-6 rounded-[32px] bg-white/[0.02] border border-white/5 border-dashed"
                >
                    <div className="flex items-center gap-3">
                        <Layers size={16} className="text-[var(--primary-500)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Bio segments: {sections.length}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-3">
                        <MessageSquare size={16} className="text-[var(--info-500)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Status: Unified View</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Zap size={14} className="text-blue-500" />
                        <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">Verified</span>
                    </div>
                </motion.div>
            )}

            {/* Delete Confirmation Architecture */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Bio Section"
                message={`Are you sure you want to delete the segment "${itemToDelete?.roleTitle}"? This cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
