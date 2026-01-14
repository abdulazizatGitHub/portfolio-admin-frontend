'use client';

import React from 'react';
import { Edit, Trash2, User, Sparkles, MessageSquare, PieChart, Layers, Zap } from 'lucide-react';
import type { AboutSection } from '@/types/about';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface AboutCardProps {
    section: AboutSection;
    onEdit: (section: AboutSection) => void;
    onDelete: (section: AboutSection) => void;
    isPrimary?: boolean;
}

/**
 * AboutCard - Premium visual card showing bio sections and metrics
 */
export function AboutCard({ section, onEdit, onDelete, isPrimary = false }: AboutCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                'card p-8 md:p-10 relative overflow-hidden group',
                isPrimary && 'ring-2 ring-[var(--primary-500)]/30 shadow-[0_0_30px_rgba(var(--primary-500-rgb),0.1)]'
            )}
        >
            {/* Background Narrative Mesh */}
            {isPrimary && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-500)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            )}

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-10">
                <div className="flex items-start gap-5">
                    {/* Identity Icon */}
                    <div className={cn(
                        "w-16 h-16 rounded-[28px] flex items-center justify-center transition-all duration-500 relative overflow-hidden shadow-2xl",
                        isPrimary
                            ? "bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] text-white"
                            : "bg-white/5 text-[var(--text-tertiary)] group-hover:bg-white/10 group-hover:text-[var(--text-secondary)]"
                    )}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <User size={32} />
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight uppercase">
                                {section.roleTitle}
                            </h3>
                            {isPrimary && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/30 text-[var(--primary-500)]">
                                    <Sparkles size={10} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Main Profile</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                            <Layers size={12} className="text-[var(--primary-500)]" />
                            <span>Section Index: {section.orderIndex}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(section)}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-tertiary)] hover:bg-[var(--primary-500)] hover:text-white hover:border-transparent transition-all duration-300 active:scale-95 group/btn"
                        aria-label={`Edit ${section.roleTitle}`}
                    >
                        <Edit size={18} className="group-hover/btn:scale-110" />
                    </button>
                    <button
                        onClick={() => onDelete(section)}
                        className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-300 active:scale-95 group/btn"
                        aria-label={`Delete ${section.roleTitle}`}
                    >
                        <Trash2 size={18} className="group-hover/btn:rotate-12" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                {/* Bio Paragraphs Stream */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center gap-3 px-1 mb-4">
                        <MessageSquare size={14} className="text-[var(--primary-500)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Bio Content</span>
                    </div>
                    <div className="space-y-6">
                        {section.paragraphs.map((para, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors relative group/para"
                            >
                                <div className="absolute -left-3 top-8 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-[var(--text-tertiary)] shadow-xl opacity-0 group-hover/para:opacity-100 transition-opacity">
                                    {idx + 1}
                                </div>
                                <p className="text-sm md:text-base font-medium text-[var(--text-secondary)] leading-relaxed">
                                    {para}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Insight Metrics Grid */}
                {section.stats && section.stats.length > 0 && (
                    <div className="lg:col-span-12 pt-6">
                        <div className="flex items-center gap-3 px-1 mb-6">
                            <PieChart size={14} className="text-[var(--accent-500)]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Key Stats</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {section.stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 flex flex-col items-center text-center space-y-2 group/stat"
                                >
                                    <span className="text-2xl font-bold text-[var(--accent-500)] tracking-tighter transition-transform">
                                        {stat.value}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            <Zap size={16} className="text-[var(--primary-500)] opacity-10" />
        </motion.div>
    );
}
