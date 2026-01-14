'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Copy, Check, ExternalLink, Sparkles, Zap } from 'lucide-react';
import {
    getContactIcon,
    getContactColor,
    generateContactHref,
    copyToClipboard
} from '@/lib/utils/contactHelpers';
import type { ContactInfoItem } from '@/types/contact';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactInfoCardProps {
    item: ContactInfoItem;
    onEdit: (item: ContactInfoItem) => void;
    onDelete: (item: ContactInfoItem) => void;
}

/**
 * ContactInfoCard - Premium visual card for contact protocols with high-fidelity feedback
 */
export function ContactInfoCard({ item, onEdit, onDelete }: ContactInfoCardProps) {
    const [copied, setCopied] = useState(false);
    const Icon = getContactIcon(item.type);
    const color = getContactColor(item.type);
    const href = item.href || generateContactHref(item.type, item.value);

    const handleCopy = async () => {
        const success = await copyToClipboard(item.value);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className="card p-6 md:p-8 relative overflow-hidden group h-full flex flex-col justify-between"
        >
            {/* Background Stream Overlay */}
            <div
                className="absolute top-0 right-0 w-40 h-40 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none transition-all duration-700 group-hover:opacity-40"
                style={{ backgroundColor: color }}
            />

            <div className="space-y-6 relative z-10">
                {/* Protocol Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-[22px] flex items-center justify-center relative shadow-2xl transition-transform duration-500 group-hover:rotate-6"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                            <Icon size={24} style={{ color }} />

                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-1 -right-1"
                            >
                                <Sparkles size={10} style={{ color }} />
                            </motion.div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">
                                {item.type}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                                    {item.label}
                                </span>
                                <AnimatePresence>
                                    {copied && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest"
                                        >
                                            <Check size={8} />
                                            Copied
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleCopy}
                            className={cn(
                                'p-2.5 rounded-xl border transition-all duration-300 active:scale-90',
                                copied
                                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'
                                    : 'bg-white/5 border-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-[var(--text-secondary)]'
                            )}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                {/* Primary Connection Node */}
                <div className="group/node relative">
                    <a
                        href={href}
                        target={item.type === 'location' ? '_blank' : undefined}
                        rel={item.type === 'location' ? 'noopener noreferrer' : undefined}
                        className="block w-full text-left"
                    >
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover/node:bg-white/[0.05] group-hover/node:border-[var(--primary-500)]/30 transition-all">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-base font-black text-[var(--text-primary)] tracking-tight truncate group-hover/node:text-[var(--primary-500)] transition-colors">
                                    {item.value}
                                </span>
                                <div className="p-1.5 rounded-lg bg-white/5 text-[var(--text-tertiary)] group-hover/node:text-[var(--primary-500)] group-hover/node:bg-[var(--primary-500)]/10 transition-all">
                                    <ExternalLink size={14} />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Sub-Actions Matrix */}
            <div className="flex items-center gap-2 mt-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 relative z-10">
                <button
                    onClick={() => onEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-all active:scale-95"
                >
                    <Edit size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Edit</span>
                </button>
                <button
                    onClick={() => onDelete(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >
                    <Trash2 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Delete</span>
                </button>
            </div>

            {/* Stability Indicator */}
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-10">
                <Zap size={12} style={{ color }} />
            </div>
        </motion.div>
    );
}
