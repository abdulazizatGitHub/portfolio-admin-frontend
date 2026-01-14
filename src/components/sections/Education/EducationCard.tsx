'use client';

import React from 'react';
import { Edit, Trash2, GraduationCap, Calendar, Sparkles, Award, BookOpen } from 'lucide-react';
import {
    getEducationIcon,
    getDegreeColor,
    parseEducationTitle,
    isCurrentEducation,
    parseAchievements
} from '@/lib/utils/educationHelpers';
import type { EducationEntry } from '@/types/education';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface EducationCardProps {
    entry: EducationEntry;
    onEdit: (entry: EducationEntry) => void;
    onDelete: (entry: EducationEntry) => void;
}

/**
 * EducationCard - Premium visual card showing academic credentials with animations
 */
export function EducationCard({ entry, onEdit, onDelete }: EducationCardProps) {
    const isCurrent = isCurrentEducation(entry);
    const { degree, institution } = parseEducationTitle(entry.title);
    const Icon = getEducationIcon(degree);
    const color = getDegreeColor(degree);
    const achievements = parseAchievements(entry.description);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={cn(
                'card p-8 md:p-10 relative overflow-hidden group h-full flex flex-col',
                isCurrent && 'ring-2 ring-[var(--accent-500)]/30 shadow-[0_0_30px_rgba(var(--accent-500-rgb),0.1)]'
            )}
        >
            {/* Background Accent Mesh */}
            <div
                className="absolute top-0 right-0 w-48 h-48 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 transition-all duration-700 group-hover:scale-110"
                style={{ backgroundColor: color }}
            />

            {/* Education Header */}
            <div className="flex items-start justify-between gap-6 mb-8 relative z-10">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                    {/* Icon */}
                    <div
                        className="w-16 h-16 rounded-[28px] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-2xl transition-transform duration-500"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <Icon size={32} style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                                {institution || degree || entry.title}
                            </h3>
                            {isCurrent && (
                                <motion.div
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Current</span>
                                </motion.div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                            <Calendar size={12} className="text-[var(--accent-500)]" />
                            <span>{entry.period}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    <button
                        onClick={() => onEdit(entry)}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-[var(--text-tertiary)] hover:bg-[var(--accent-500)] hover:text-white transition-all duration-300 active:scale-95"
                        aria-label={`Edit ${entry.title}`}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-95"
                        aria-label={`Delete ${entry.title}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Degree Details */}
            {institution && degree && (
                <div className="mb-6 relative z-10 px-1">
                    <p className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Award size={18} className="text-[var(--accent-500)]" />
                        {degree}
                    </p>
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div className="mt-auto space-y-4 relative z-10">
                    <div className="flex items-center gap-2 px-1">
                        <BookOpen size={12} className="text-[var(--text-tertiary)]" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Key Achievements</span>
                    </div>
                    <div className="space-y-3">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-500)]/40 mt-1.5 flex-shrink-0" />
                                <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                    {achievement}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gloss Highlight Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
    );
}
