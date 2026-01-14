'use client';

import React from 'react';
import { Eye, Sparkles, Terminal } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/skillHelpers';
import type { SkillCategory } from '@/types/skills';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioPreviewHintProps {
    skillName: string;
    category: SkillCategory;
    level: number;
    className?: string;
}

const categoryLabels: Record<SkillCategory, string> = {
    frontend: 'Frontend Interface',
    backend: 'Backend Logic',
    database: 'Data Architecture',
    devops: 'Infrastructure',
    tools: 'Developer Tooling',
    soft: 'Strategic Soft Skill',
    technical: 'Technical Protocol',
    ai: 'Cognitive Engine',
};

const categoryColors: Record<SkillCategory, string> = {
    frontend: '#3B82F6',
    backend: '#10B981',
    database: '#F59E0B',
    devops: '#8B5CF6',
    tools: '#EC4899',
    soft: '#14B8A6',
    technical: '#6366F1',
    ai: '#F43F5E',
};

/**
 * PortfolioPreviewHint - Premium visual simulation of public exposition card
 */
export function PortfolioPreviewHint({
    skillName,
    category,
    level,
    className
}: PortfolioPreviewHintProps) {
    const displayName = skillName || 'Uninitialized Skill';
    const levelLabel = getLevelLabel(level);
    const categoryColor = categoryColors[category];

    return (
        <div className={cn('space-y-4', className)}>
            {/* Simulation Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-[var(--text-tertiary)]">
                        <Eye size={14} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        Exposition Simulation
                    </h3>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
                    ))}
                </div>
            </div>

            {/* Simulated Card Architecture */}
            <motion.div
                initial={false}
                animate={{
                    borderColor: `${categoryColor}30`,
                    background: `linear-gradient(135deg, white/[0.03] 0%, ${categoryColor}05 100%)`
                }}
                className="p-8 rounded-[40px] border-2 border-dashed relative overflow-hidden group/preview"
            >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(${categoryColor} 1px, transparent 1px)`, backgroundSize: '16px 16px' }}
                />

                <div className="flex items-start justify-between gap-6 relative z-10">
                    <div className="flex-1 min-w-0 space-y-4">
                        <div className="space-y-1">
                            <AnimatePresence mode="wait">
                                <motion.h4
                                    key={displayName}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl font-[900] text-[var(--text-primary)] tracking-tight truncate"
                                >
                                    {displayName}
                                </motion.h4>
                            </AnimatePresence>
                            <div className="flex items-center gap-2">
                                <Terminal size={12} className="text-[var(--text-tertiary)]" />
                                <span className="text-[10px] font-medium text-[var(--text-tertiary)] italic">Public Node ID: {displayName.toLowerCase().replace(/\s+/g, '-')}</span>
                            </div>
                        </div>

                        {/* Simulated Metadata Badges */}
                        <div className="flex items-center gap-3">
                            <motion.span
                                layoutId="preview-category"
                                className="inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border shadow-lg shadow-black/5"
                                style={{
                                    backgroundColor: `${categoryColor}15`,
                                    color: categoryColor,
                                    borderColor: `${categoryColor}30`
                                }}
                            >
                                {categoryLabels[category]}
                            </motion.span>

                            <span className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                {levelLabel}
                            </span>
                        </div>
                    </div>

                    {/* Numeric Loadout Indicator */}
                    <div className="flex-shrink-0">
                        <motion.div
                            layoutId="preview-level"
                            className="w-20 h-20 rounded-[30px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                            style={{
                                backgroundColor: `${categoryColor}10`,
                                border: `2px solid ${categoryColor}40`
                            }}
                        >
                            <span className="text-[10px] font-black text-[var(--text-tertiary)] absolute top-2 uppercase tracking-tighter">Load</span>
                            <span
                                className="text-3xl font-black mt-2 transition-all duration-500"
                                style={{ color: categoryColor, textShadow: `0 0 20px ${categoryColor}40` }}
                            >
                                {level}
                            </span>
                            <Sparkles size={12} className="absolute bottom-2 opacity-30" style={{ color: categoryColor }} />
                        </motion.div>
                    </div>
                </div>

                {/* Simulated Glass Highlight */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.05] to-transparent pointer-events-none" />
            </motion.div>

            {/* Heuristic Notice */}
            <div className="flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-500)] animate-pulse" />
                <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic leading-relaxed">
                    Note: High-fidelity simulation. Production rendering subject to global CSS reconciliation.
                </p>
            </div>
        </div>
    );
}
