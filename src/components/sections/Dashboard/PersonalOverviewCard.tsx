'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, FileCheck, Globe } from 'lucide-react';
import { usePersonalContent } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function PersonalOverviewCard() {
    const { data: profile, isLoading } = usePersonalContent();

    if (isLoading) {
        return (
            <div className="card h-full min-h-[300px] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="card h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)]">
                <User size={48} className="mb-4 opacity-20" />
                <p>No primary profile found. Set a default profile in the Personal section.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden group rounded-[32px] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border-subtle)] shadow-2xl"
        >
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--primary-400)]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--secondary-400)]/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 p-8 lg:p-14 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
                {/* Profile Visual Section */}
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        className="w-48 h-48 lg:w-64 lg:h-64 rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/50 dark:border-white/10 bg-gradient-to-tr from-[var(--primary-200)] to-[var(--secondary-200)] flex items-center justify-center relative"
                    >
                        {/* Placeholder for real image in the future */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--secondary-500)]/20 z-0" />
                        <User size={120} className="text-white/80 relative z-10" />
                    </motion.div>

                    {/* Floating Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-4 -right-2 px-5 py-3 bg-[var(--bg-surface)] dark:bg-slate-900 rounded-2xl shadow-xl flex items-center gap-2 border border-[var(--border-subtle)]"
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--success-500)] animate-pulse" />
                        <span className="text-sm font-bold text-[var(--text-primary)]">Open for Innovation</span>
                    </motion.div>
                </div>

                {/* Identity Info */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
                        <h1 className="text-4xl lg:text-6xl font-[900] text-[var(--text-primary)] tracking-tight">
                            {profile.name}
                        </h1>
                        <div className="flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/20">
                            <Sparkles size={16} fill="currentColor" />
                            <span className="text-xs font-[800] uppercase tracking-widest">Master Talent</span>
                        </div>
                    </div>

                    <p className="text-xl lg:text-3xl font-bold text-[var(--text-secondary)] mb-8 leading-tight">
                        {profile.titlePrefix} <span className="underline decoration-[var(--primary-500)] decoration-4 underline-offset-8">{profile.roles?.[0]}</span> & Digital Architect.
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
                        <div className="flex items-center gap-2.5 text-[var(--text-secondary)] group/item">
                            <div className="p-2 rounded-xl bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/30 group-hover/item:scale-110 transition-transform">
                                <Globe size={18} className="text-[var(--primary-500)]" />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Global Connectivity</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[var(--text-secondary)] group/item">
                            <div className="p-2 rounded-xl bg-[var(--secondary-50)] dark:bg-[var(--secondary-900)]/30 group-hover/item:scale-110 transition-transform">
                                <FileCheck size={18} className="text-[var(--secondary-500)]" />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Verified Credentials</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        {profile.roles?.map((role: string, idx: number) => (
                            <motion.span
                                key={idx}
                                whileHover={{ y: -2 }}
                                className="px-5 py-2.5 rounded-2xl bg-[var(--bg-surface)] dark:bg-white/5 border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-secondary)] shadow-sm hover:shadow-md hover:border-[var(--primary-500)]/30 transition-all cursor-default"
                            >
                                {role}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Hero Quick Insights */}
                <div className="hidden xl:flex flex-col gap-5 self-center">
                    <div className="p-5 rounded-[24px] bg-[var(--bg-surface)] dark:bg-white/5 shadow-xl border border-[var(--border-subtle)] w-52 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/20 transition-all cursor-default group/stat">
                        <div className="text-[var(--text-tertiary)] text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Status</div>
                        <div className="text-2xl font-black text-[var(--primary-600)] dark:text-[var(--primary-400)]">MISSION READY</div>
                    </div>
                    <div className="p-5 rounded-[24px] bg-[var(--bg-surface)] dark:bg-white/5 shadow-xl border border-[var(--border-subtle)] w-52 hover:bg-[var(--secondary-50)] dark:hover:bg-[var(--secondary-900)]/20 transition-all cursor-default group/stat">
                        <div className="text-[var(--text-tertiary)] text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Engine</div>
                        <div className="text-2xl font-black text-[var(--secondary-600)] dark:text-[var(--secondary-400)]">PLATFORM V1</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
