'use client';

import React from 'react';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/skillHelpers';
import type { Skill, SkillCategory } from '@/types/skills';
import { cn } from '@/lib/utils/cn';

interface SkillCardProps {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (skill: Skill) => void;
    isDragging?: boolean;
}

// Use hex colors instead of CSS variables for gradient support
const categoryColors: Record<SkillCategory, { bg: string; text: string; border: string }> = {
    frontend: { bg: '#5B93FF', text: '#5B93FF', border: '#5B93FF' }, // Blue
    backend: { bg: '#5DCCB4', text: '#5DCCB4', border: '#5DCCB4' }, // Teal
    database: { bg: '#8B5CF6', text: '#8B5CF6', border: '#8B5CF6' }, // Purple
    devops: { bg: '#F59E0B', text: '#F59E0B', border: '#F59E0B' }, // Yellow/Orange
    tools: { bg: '#EC4899', text: '#EC4899', border: '#EC4899' }, // Pink
    soft: { bg: '#10B981', text: '#10B981', border: '#10B981' }, // Green
    technical: { bg: '#6366F1', text: '#6366F1', border: '#6366F1' }, // Indigo
    ai: { bg: '#8B5CF6', text: '#8B5CF6', border: '#8B5CF6' }, // Violet
};

import { motion } from 'framer-motion';

/**
 * SkillCard - Enhanced visual card for displaying skills with proficiency
 */
export function SkillCard({ skill, onEdit, onDelete, isDragging = false }: SkillCardProps) {
    const levelLabel = getLevelLabel(skill.level);
    const categoryColor = categoryColors[skill.category];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={cn(
                'group relative flex items-center gap-5 p-5 rounded-[22px] card',
                'border-[var(--border-subtle)] hover:border-[var(--primary-500)]/30 transition-all duration-300',
                isDragging && 'opacity-50 scale-95'
            )}
        >
            {/* Drag Handle */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab hidden sm:block">
                <GripVertical className="w-5 h-5 text-[var(--text-tertiary)]" />
            </div>

            {/* Skill Info */}
            <div className="flex-1 min-w-0 space-y-4">
                {/* Skill Name and Level */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">
                            {skill.name}
                        </h3>
                        {skill.context && (
                            <p className="text-xs font-medium text-[var(--text-tertiary)] mt-0.5 line-clamp-1 italic">
                                {skill.context}
                            </p>
                        )}
                    </div>

                    {/* Level Badge */}
                    <div className="flex-shrink-0">
                        <div
                            className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border"
                            style={{
                                backgroundColor: `${categoryColor.bg}15`,
                                color: categoryColor.text,
                                borderColor: `${categoryColor.text}30`
                            }}
                        >
                            {levelLabel}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <span className="text-[var(--text-tertiary)]">Proficiency</span>
                        <span style={{ color: categoryColor.text }}>{skill.level}%</span>
                    </div>
                    <div className="relative h-2.5 bg-[var(--bg-tertiary)] dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                            style={{
                                background: `linear-gradient(270deg, ${categoryColor.bg}, ${categoryColor.bg}88)`
                            }}
                        >
                            {/* Animated Inner Shine */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] animate-[shimmer_2s_infinite] -skew-x-12" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Actions - Modern Floating Style */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <button
                    onClick={() => onEdit(skill)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/20 transition-colors"
                    aria-label={`Edit ${skill.name}`}
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(skill)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--error-500)] hover:bg-[var(--error-50)] dark:hover:bg-[var(--error-900)]/20 transition-colors"
                    aria-label={`Delete ${skill.name}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

