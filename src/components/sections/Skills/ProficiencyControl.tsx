'use client';

import React from 'react';
import {
    getProficiencyLevelInfo,
    proficiencyLevels
} from '@/lib/utils/skillHelpers';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';

interface ProficiencyControlProps {
    value: number; // 0-100
    onChange: (value: number) => void;
    error?: string;
    disabled?: boolean;
}

/**
 * ProficiencyControl - Premium slider with heuristic proficiency level indicators
 */
export function ProficiencyControl({
    value,
    onChange,
    error,
    disabled = false
}: ProficiencyControlProps) {
    const levelInfo = getProficiencyLevelInfo(value);
    const percentage = value;

    const getColor = () => {
        if (value >= 85) return '#10B981'; // Expert
        if (value >= 60) return '#3B82F6'; // Advanced
        if (value >= 25) return '#F59E0B'; // Intermediate
        return '#6B7280'; // Beginner
    };

    return (
        <div className="space-y-6">
            {/* Semantic Feedback Core */}
            <div className="flex items-center justify-between p-5 rounded-[28px] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                    <div
                        className="p-2.5 rounded-xl transition-all duration-500"
                        style={{ backgroundColor: `${getColor()}15`, color: getColor() }}
                    >
                        <Target size={20} className={cn("transition-transform duration-500", value > 80 && "scale-110 rotate-12")} />
                    </div>
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-0.5">Assessment Matrix</span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={levelInfo.label}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="block text-sm font-[900] text-[var(--text-primary)]"
                            >
                                {levelInfo.label}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="text-right relative z-10">
                    <span
                        className="text-2xl font-black transition-all duration-500 tabular-nums"
                        style={{ color: getColor() }}
                    >
                        {value}%
                    </span>
                    <span className="block text-[10px] font-medium text-[var(--text-tertiary)] italic">Spectral Load</span>
                </div>

                {/* Animated Background Mesh */}
                <motion.div
                    animate={{
                        opacity: [0.03, 0.08, 0.03],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none -z-10"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${getColor()}20 0%, transparent 70%)` }}
                />
            </div>

            {/* Heuristic Description */}
            <div className="px-6 py-4 rounded-[24px] bg-white/[0.02] border border-white/5 border-dashed">
                <p className="text-[11px] font-medium text-[var(--text-secondary)] leading-relaxed italic">
                    <Sparkles size={12} className="inline-block mr-2 text-[var(--text-tertiary)]" />
                    {levelInfo.description}
                </p>
            </div>

            {/* Premium Control Axis */}
            <div className="relative pt-4 pb-8 group/slider">
                {/* Track Architecture */}
                <div className="relative h-3 bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                    {/* Active Gradient Stream */}
                    <motion.div
                        className="absolute top-0 left-0 h-full transition-all duration-300 relative overflow-hidden"
                        style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${getColor()}30 0%, ${getColor()} 100%)`
                        }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                </div>

                {/* Range Input Interactor */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={disabled}
                    className="absolute top-4 left-0 w-full h-3 opacity-0 cursor-ew-resize disabled:cursor-not-allowed z-30"
                    aria-label="Skill proficiency calibration"
                />

                {/* Threshold Synchronizers */}
                <div className="absolute top-4 left-0 right-0 flex justify-between px-0.5 pointer-events-none">
                    {proficiencyLevels.map((level, index) => {
                        const position = level.range[0];
                        const isActive = value >= level.range[0] && (index === proficiencyLevels.length - 1 || value < proficiencyLevels[index + 1].range[0]);

                        return (
                            <div
                                key={level.level}
                                className="absolute flex flex-col items-center"
                                style={{ left: `${position}%` }}
                            >
                                {/* Neural Nodes */}
                                <div
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-all duration-500 ring-2',
                                        isActive
                                            ? 'scale-125 ring-white/50 bg-white'
                                            : 'ring-white/5 bg-white/10'
                                    )}
                                />

                                {/* Designation Markers */}
                                <div className={cn(
                                    'mt-6 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap',
                                    isActive ? 'text-[var(--text-primary)] translate-y-0 opacity-100' : 'text-[var(--text-tertiary)] opacity-30 -translate-y-1'
                                )}>
                                    {level.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Error Metadata */}
            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-bold text-[var(--error-500)] ml-2 uppercase tracking-widest"
                >
                    Calibration Alert: {error}
                </motion.p>
            )}

            {/* Heuristic Reminder */}
            <div className="flex items-center gap-3 px-2 text-[10px] font-medium text-[var(--text-tertiary)] italic leading-relaxed">
                <Zap size={12} className="text-[var(--primary-500)]" />
                Empirical evidence suggests authenticity correlates with architectural integrity.
            </div>
        </div>
    );
}
