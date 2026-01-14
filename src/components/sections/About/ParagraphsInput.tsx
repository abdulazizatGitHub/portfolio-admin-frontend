'use client';

import React from 'react';
import { Plus, Trash2, FileText, Sparkles, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ParagraphsInputProps {
    value: string[];
    onChange: (paragraphs: string[]) => void;
    error?: string;
}

/**
 * ParagraphsInput - Premium dynamic list of bio paragraphs with animations
 */
export function ParagraphsInput({ value, onChange, error }: ParagraphsInputProps) {
    const paragraphs = value.length > 0 ? value : [''];

    const handleChange = (index: number, text: string) => {
        const updated = [...paragraphs];
        updated[index] = text;
        onChange(updated);
    };

    const handleAdd = () => {
        onChange([...paragraphs, '']);
    };

    const handleRemove = (index: number) => {
        if (paragraphs.length <= 1) return;
        const updated = paragraphs.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] leading-none mb-1">
                            Bio Paragraphs
                        </h3>
                        <p className="text-[10px] font-medium text-[var(--text-tertiary)] ml-1">
                            You have {paragraphs.length} paragraph{paragraphs.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="group relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary-500)]/10 text-[var(--primary-500)] border border-[var(--primary-500)]/20 hover:bg-[var(--primary-500)] hover:text-white transition-all duration-300 overflow-hidden active:scale-95"
                >
                    <Plus size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Paragraph</span>
                </button>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {paragraphs.map((paragraph, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="relative group/segment"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2 mt-4 ml-1">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[var(--text-tertiary)]">
                                        {index + 1}
                                    </div>
                                    <div className="w-0.5 flex-1 bg-gradient-to-b from-white/10 to-transparent min-h-[40px]" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="relative group/input">
                                        <textarea
                                            value={paragraph}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            placeholder={`Write paragraph ${index + 1}...`}
                                            rows={4}
                                            className={cn(
                                                'w-full px-6 py-4 rounded-[28px] resize-none transition-all duration-500 premium-input text-sm font-medium',
                                                'border-2 border-white/5 focus:border-[var(--primary-500)] bg-white/[0.03]'
                                            )}
                                        />
                                        <div className="absolute right-4 bottom-4 px-2 py-1 rounded-lg bg-white/5 border border-white/10 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                            <span className={cn(
                                                "text-[9px] font-bold tracking-widest uppercase",
                                                paragraph.length > 450 ? "text-amber-500" : "text-[var(--text-tertiary)]"
                                            )}>
                                                {paragraph.length} / 500
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {paragraphs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 opacity-0 group-hover/segment:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-300 mt-4 active:scale-95"
                                        aria-label="Delete paragraph"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
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

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
                <Sparkles size={14} className="text-[var(--primary-500)]" />
                <p className="text-[10px] font-medium text-[var(--text-tertiary)] leading-relaxed">
                    These paragraphs will be shown in your about section.
                </p>
            </div>
        </div>
    );
}
