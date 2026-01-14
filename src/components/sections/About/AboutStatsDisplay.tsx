'use client';

import React from 'react';
import type { AboutStat } from '@/types/about';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

interface AboutStatsDisplayProps {
    stats: AboutStat[];
}

/**
 * AboutStatsDisplay - Premium glassmorphic stats grid with high-fidelity animations
 */
export function AboutStatsDisplay({ stats }: AboutStatsDisplayProps) {
    if (!stats || stats.length === 0) return null;

    const gradients = [
        'from-blue-500/20 to-purple-600/20 shadow-blue-500/10',
        'from-emerald-500/20 to-teal-600/20 shadow-emerald-500/10',
        'from-orange-500/20 to-red-500/20 shadow-orange-500/10',
        'from-pink-500/20 to-rose-600/20 shadow-pink-500/10',
        'from-indigo-500/20 to-blue-600/20 shadow-indigo-500/10',
        'from-amber-500/20 to-orange-600/20 shadow-amber-500/10',
    ];

    const accentColors = [
        'text-blue-400',
        'text-emerald-400',
        'text-orange-400',
        'text-pink-400',
        'text-indigo-400',
        'text-amber-400',
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={`${stat.label}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className={cn(
                        'relative overflow-hidden rounded-[32px] p-6 border border-white/10 glass-panel',
                        'bg-gradient-to-br shadow-2xl',
                        gradients[index % gradients.length]
                    )}
                >
                    {/* Background decoration elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 blur-2xl" />

                    {/* Content Matrix */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                            <Sparkles size={10} className={accentColors[index % accentColors.length]} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Insight Node</span>
                        </div>

                        <div className={cn(
                            "text-3xl font-black tracking-tight mb-1",
                            accentColors[index % accentColors.length]
                        )}>
                            {stat.value}
                        </div>

                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                            {stat.label}
                        </div>

                        {/* Interactive Micro-animation indicator */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="mt-4 pt-4 border-t border-white/5 w-full flex justify-center"
                        >
                            <Zap size={14} className={cn("opacity-40", accentColors[index % accentColors.length])} />
                        </motion.div>
                    </div>

                    {/* Gloss Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </motion.div>
            ))}
        </div>
    );
}
