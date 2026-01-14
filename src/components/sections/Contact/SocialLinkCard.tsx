'use client';

import React from 'react';
import { Edit, Trash2, ExternalLink, Sparkles, Globe, Share2 } from 'lucide-react';
import {
    getSocialIcon,
    getPlatformColor,
    formatUrlDisplay
} from '@/lib/utils/contactHelpers';
import type { SocialLink } from '@/types/contact';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface SocialLinkCardProps {
    link: SocialLink;
    onEdit: (link: SocialLink) => void;
    onDelete: (link: SocialLink) => void;
}

/**
 * SocialLinkCard - Premium visual card for nexus nodes with platform-specific branding
 */
export function SocialLinkCard({ link, onEdit, onDelete }: SocialLinkCardProps) {
    const Icon = getSocialIcon(link.platform);
    const color = getPlatformColor(link.platform);
    const displayUrl = formatUrlDisplay(link.url, 40);

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="card p-8 relative overflow-hidden group h-full flex flex-col justify-between"
        >
            {/* Background Branding Matrix */}
            <div
                className="absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-10 transition-all duration-700 group-hover:opacity-30 group-hover:scale-125"
                style={{ backgroundColor: color }}
            />

            <div className="relative z-10 space-y-8">
                {/* Node Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div
                            className="w-16 h-16 rounded-[28px] flex items-center justify-center relative shadow-2xl transition-transform duration-700 group-hover:rotate-12"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                            <Icon size={28} style={{ color }} />

                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -bottom-1 -left-1 p-1 rounded-lg bg-white/5 border border-white/10"
                            >
                                <Share2 size={10} style={{ color }} />
                            </motion.div>
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase group-hover:text-[var(--primary-500)] transition-colors">
                                {link.platform}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] italic">
                                    Social Link {link.id}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                    <Globe size={8} className="text-[var(--text-tertiary)]" />
                                    <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase leading-none">Global Segment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Connection Bridge (URL) */}
                <div className="group/bridge relative">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] px-1">Link URL</span>
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover/bridge:bg-white/[0.05] group-hover/bridge:border-white/20 transition-all flex items-center justify-between gap-4 overflow-hidden">
                            <span className="text-xs font-medium text-[var(--text-secondary)] truncate italic flex-1" title={link.url}>
                                {displayUrl}
                            </span>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/5 text-[var(--text-tertiary)] hover:bg-[var(--primary-500)] hover:text-white transition-all active:scale-95 shadow-lg group/link"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={14} className="group-hover/link:animate-pulse" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal Actions Matrix */}
            <div className="flex items-center gap-3 mt-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 relative z-10">
                <button
                    onClick={() => onEdit(link)}
                    className="flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-[var(--text-primary)] transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                >
                    <Edit size={14} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(link)}
                    className="flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                >
                    <Trash2 size={14} />
                    Delete
                </button>
            </div>

            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-6 right-8 text-[var(--primary-500)]"
            >
                <Sparkles size={16} />
            </motion.div>
        </motion.div>
    );
}
