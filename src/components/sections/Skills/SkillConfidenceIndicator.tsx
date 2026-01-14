'use client';

import React from 'react';
import { Info, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import {
    type ConfidenceLevel,
    getConfidenceLevelInfo
} from '@/lib/utils/skillHelpers';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface SkillConfidenceIndicatorProps {
    confidence: ConfidenceLevel;
    className?: string;
}

/**
 * SkillConfidenceIndicator - Premium non-editable confidence signal indicator
 */
export function SkillConfidenceIndicator({
    confidence,
    className
}: SkillConfidenceIndicatorProps) {
    const info = getConfidenceLevelInfo(confidence);

    const getIcon = () => {
        switch (confidence) {
            case 'high': return <ShieldCheck size={20} />;
            case 'medium': return <Zap size={20} />;
            case 'low': return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getColors = () => {
        switch (confidence) {
            case 'high': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
            case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
            case 'low': return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20' };
            default: return { bg: 'bg-white/5', text: 'text-white/50', border: 'border-white/10' };
        }
    };

    const colors = getColors();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex items-center gap-5 p-6 rounded-[32px] glass-panel border transition-all duration-500',
                colors.border,
                className
            )}
        >
            <div className={cn(
                "p-3 rounded-2xl flex-shrink-0 relative overflow-hidden",
                colors.bg,
                colors.text
            )}>
                {getIcon()}
                {/* Micro-sparkle for high confidence */}
                {confidence === 'high' && (
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"
                    />
                )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                        Confidence Signal
                    </span>
                    <motion.span
                        key={confidence}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            'px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border',
                            colors.bg,
                            colors.text,
                            colors.border
                        )}
                    >
                        {info.label}
                    </motion.span>
                </div>

                <p className="text-[11px] font-medium text-[var(--text-tertiary)] italic leading-relaxed">
                    {info.description}
                </p>
            </div>

            {/* Background Accent */}
            <div className={cn(
                "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full pointer-events-none",
                colors.bg
            )} />
        </motion.div>
    );
}
