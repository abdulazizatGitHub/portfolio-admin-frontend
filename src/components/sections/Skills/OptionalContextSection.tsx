'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface OptionalContextSectionProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const MAX_CONTEXT_LENGTH = 200;

const examplePrompts = [
    'Production Systems',
    'Academic Research',
    'Open Source',
    'Team Mentorship',
    'Architectural Migration',
];

/**
 * OptionalContextSection - Premium collapsible section for skill usage context
 */
export function OptionalContextSection({
    value,
    onChange,
    disabled = false
}: OptionalContextSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const characterCount = value.length;
    const isOverLimit = characterCount > MAX_CONTEXT_LENGTH;

    return (
        <div className="space-y-4">
            {/* Collapsible Trigger */}
            <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsExpanded(!isExpanded)}
                disabled={disabled}
                className={cn(
                    'w-full flex items-center justify-between p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden group',
                    isExpanded
                        ? 'bg-[var(--primary-500)]/10 border-2 border-[var(--primary-500)]/30 shadow-lg shadow-[var(--primary-500)]/5'
                        : 'bg-white/[0.03] border-2 border-white/5 hover:border-white/10'
                )}
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                        "p-2.5 rounded-xl transition-all duration-500",
                        isExpanded ? "bg-[var(--primary-500)] text-white" : "bg-white/5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                    )}>
                        <MessageSquare size={18} />
                    </div>
                    <div className="text-left">
                        <h3 className={cn(
                            "text-sm font-black uppercase tracking-widest leading-none mb-1",
                            isExpanded ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                        )}>
                            Contextual Narrative
                            {!isExpanded && (
                                <span className="ml-2 py-0.5 px-2 rounded-full bg-white/5 text-[9px] font-medium text-[var(--text-tertiary)] italic normal-case tracking-normal">
                                    Optional protocol
                                </span>
                            )}
                        </h3>
                        <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic">
                            {isExpanded
                                ? 'Refining technical application parameters'
                                : 'Expand to enhance skill signal verification'}
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className={cn(
                            "p-1.5 rounded-full transition-colors",
                            isExpanded ? "bg-[var(--primary-500)]/20 text-[var(--primary-500)]" : "bg-white/5 text-[var(--text-tertiary)]"
                        )}
                    >
                        <ChevronDown size={14} />
                    </motion.div>
                </div>

                {/* Background Shimmer */}
                {isExpanded && (
                    <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(var(--primary-500-rgb),0.05)_50%,transparent_100%)] animate-[shimmer_3s_infinite]" />
                )}
            </motion.button>

            {/* Expansion Matrix */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.98 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.98 }}
                        className="overflow-hidden space-y-4"
                    >
                        <div className="p-8 glass-panel rounded-[40px] border-white/10 shadow-2xl space-y-6">
                            {/* Heuristic Prompts */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">
                                    <Sparkles size={12} className="text-[var(--primary-500)]" />
                                    Syntactic Templates
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {examplePrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() => {
                                                if (!value) {
                                                    onChange(`Integrated in ${prompt}...`);
                                                } else if (!value.includes(prompt)) {
                                                    onChange(value + (value.endsWith('.') ? ' ' : '. ') + `Applied in ${prompt}.`);
                                                }
                                            }}
                                            disabled={disabled}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-[var(--text-secondary)] hover:bg-[var(--primary-500)] hover:text-white hover:border-transparent transition-all active:scale-95 shadow-sm"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Narrative Input Architecture */}
                            <div className="relative group/input">
                                <textarea
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    disabled={disabled}
                                    rows={4}
                                    placeholder="Elucidate on practical application instances (e.g., 'Engineered full-stack architecture for 10K+ concurrent users')"
                                    className={cn(
                                        'w-full px-6 py-5 rounded-[32px] border-2 resize-none transition-all duration-500 text-sm font-medium premium-input',
                                        isOverLimit
                                            ? 'border-[var(--error-500)]/50 focus:border-[var(--error-500)]'
                                            : 'border-white/5 focus:border-[var(--primary-500)]'
                                    )}
                                />

                                {/* Matrix Status Metadata */}
                                <div className="absolute bottom-4 right-6 flex items-center gap-3">
                                    <div className={cn(
                                        'text-[9px] font-black tracking-widest px-2 py-1 rounded-lg transition-all',
                                        isOverLimit
                                            ? 'bg-[var(--error-500)]/20 text-[var(--error-500)]'
                                            : characterCount > MAX_CONTEXT_LENGTH * 0.8
                                                ? 'bg-amber-500/20 text-amber-500'
                                                : 'bg-white/5 text-[var(--text-tertiary)]'
                                    )}>
                                        {characterCount}/{MAX_CONTEXT_LENGTH}
                                    </div>
                                    {isOverLimit && <motion.div animate={{ rotate: [0, 15, -15, 0] }}><Zap size={14} className="text-[var(--error-500)]" /></motion.div>}
                                </div>
                            </div>

                            {/* Narrative Guidance */}
                            <div className="flex items-center gap-3 px-2 text-[10px] font-medium text-[var(--text-tertiary)] italic leading-relaxed">
                                <Zap size={12} className="text-[var(--primary-500)] min-w-[12px]" />
                                <span>{isOverLimit ? 'Narrative threshold exceeded. Please truncate for optimal signal precision.' : 'Concision is the core of technical credibility. Focus on empirical impact.'}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
