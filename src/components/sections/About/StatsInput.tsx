'use client';

import React from 'react';
import { Plus, Trash2, PieChart, Sparkles, Zap, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AboutStat } from '@/types/about';
import { cn } from '@/lib/utils/cn';

interface StatsInputProps {
    value: AboutStat[];
    onChange: (stats: AboutStat[]) => void;
    error?: string;
}

/**
 * StatsInput - Premium dynamic key-value pairs for highlights with animations
 */
export function StatsInput({ value, onChange, error }: StatsInputProps) {
    const stats = value.length > 0 ? value : [{ label: '', value: '' }];

    const handleChange = (index: number, field: 'label' | 'value', text: string) => {
        const updated = [...stats];
        updated[index] = { ...updated[index], [field]: text };
        onChange(updated);
    };

    const handleAdd = () => {
        onChange([...stats, { label: '', value: '' }]);
    };

    const handleRemove = (index: number) => {
        if (stats.length <= 1) return;
        const updated = stats.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                        <PieChart size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] leading-none mb-1">
                            Key Stats
                        </h3>
                        <p className="text-[10px] font-medium text-[var(--text-tertiary)] ml-1">
                            Manage your {stats.length} high-impact stats
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="group relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-500)]/10 text-[var(--accent-500)] border border-[var(--accent-500)]/20 hover:bg-[var(--accent-500)] hover:text-white transition-all duration-300 overflow-hidden active:scale-95"
                >
                    <Plus size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Stat</span>

                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                            className="group/stat relative flex items-center gap-4 p-2 rounded-[32px] hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group/input">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent-500)] transition-colors pointer-events-none">
                                        <Sparkles size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        value={stat.label}
                                        onChange={(e) => handleChange(index, 'label', e.target.value)}
                                        placeholder="Label (e.g., Experience)"
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-white/5 focus:border-[var(--accent-500)] transition-all bg-white/[0.03] outline-none premium-input text-sm font-semibold"
                                    />
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent-500)] transition-colors pointer-events-none">
                                        <Hash size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        value={stat.value}
                                        onChange={(e) => handleChange(index, 'value', e.target.value)}
                                        placeholder="Value (e.g., 5+ Years)"
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-white/5 focus:border-[var(--accent-500)] transition-all bg-white/[0.03] outline-none premium-input text-sm font-bold"
                                    />
                                </div>
                            </div>

                            {stats.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 opacity-0 group-hover/stat:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-95"
                                    aria-label="Delete stat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-bold text-[var(--error-500)] ml-2 uppercase tracking-widest px-4 py-2 rounded-lg bg-rose-500/5 border border-rose-500/10"
                >
                    Error: {error}
                </motion.p>
            )}

            <div className="flex items-center gap-3 px-4 py-4 rounded-3xl bg-white/[0.02] border border-white/5 border-dashed">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Zap size={14} />
                </div>
                <p className="text-[10px] font-medium text-[var(--text-tertiary)] leading-relaxed">
                    These stats will be prominently displayed on your profile.
                </p>
            </div>
        </div>
    );
}
