'use client';

import React from 'react';
import { Edit, Trash2, GripVertical, Star, FileText, Download, CheckCircle2 } from 'lucide-react';
import { getRoleBadgeColor, formatCVSize, getFileExtension } from '@/lib/utils/personalHelpers';
import type { PersonalProfile } from '@/types/personal';
import { cn } from '@/lib/utils/cn';

interface PersonalCardProps {
    profile: PersonalProfile;
    onEdit: (profile: PersonalProfile) => void;
    onDelete: (profile: PersonalProfile) => void;
    onSetDefault?: (profile: PersonalProfile) => void;
}

import { motion } from 'framer-motion';

/**
 * PersonalCard - Visually outstanding card showing profile highlights, roles, and CV info
 */
export function PersonalCard({ profile, onEdit, onDelete, onSetDefault }: PersonalCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className={cn(
                'group relative flex flex-col p-8 rounded-[32px] card h-full',
                'transition-all duration-500',
                profile.isDefault
                    ? 'border-[var(--primary-500)] shadow-[var(--primary-100)] shadow-2xl z-10'
                    : 'border-[var(--border-subtle)] hover:border-[var(--primary-500)]/30 hover:shadow-xl'
            )}
        >
            {/* Primary Badge */}
            {profile.isDefault && (
                <div className="absolute top-0 right-0 bg-[var(--primary-500)] text-white text-[10px] font-black px-5 py-2 rounded-bl-2xl tracking-widest flex items-center gap-2 shadow-lg z-20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    PRIMARY IDENTITY
                </div>
            )}

            {/* Header Info */}
            <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white text-3xl font-black shadow-2xl relative overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {profile.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-2xl font-black text-[var(--text-primary)] truncate tracking-tight mb-1">
                        {profile.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] text-[10px] font-black uppercase tracking-wider border border-[var(--primary-100)] dark:border-[var(--primary-900)]/30">
                            {profile.titlePrefix}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-tertiary)]">
                            <CheckCircle2 size={14} className="text-[var(--success-500)]" />
                            Verified
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            <div className="mb-8">
                <div className="relative p-5 rounded-2xl bg-[var(--bg-base)]/50 dark:bg-black/10 border border-[var(--border-subtle)] shadow-inner">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 italic font-semibold tracking-tight">
                        &quot;{profile.description}&quot;
                    </p>
                    <div className="absolute -left-1 top-4 w-1 h-8 bg-[var(--primary-500)] rounded-full" />
                </div>
            </div>

            {/* Roles Grid */}
            <div className="mb-10">
                <div className="flex flex-wrap gap-2.5">
                    {profile.roles.map((role, index) => (
                        <span
                            key={role}
                            style={{
                                backgroundColor: `${getRoleBadgeColor(index)}10`,
                                color: getRoleBadgeColor(index),
                                borderColor: `${getRoleBadgeColor(index)}30`
                            }}
                            className="px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border shadow-sm transition-transform hover:scale-105 cursor-default"
                        >
                            {role}
                        </span>
                    ))}
                </div>
            </div>

            {/* CV Info & Actions Container */}
            <div className="mt-auto flex flex-col gap-6">
                <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] dark:bg-white/5 text-[var(--text-secondary)] shadow-sm border border-[var(--border-subtle)]">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-[var(--text-primary)] truncate max-w-[180px] tracking-tight">
                                {profile.cvFileName || 'Resume.pdf'}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-black tracking-widest">
                                    {getFileExtension(profile.cvFileName || 'pdf')} • {formatCVSize(profile.cvFile || '')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!profile.isDefault && onSetDefault && (
                            <button
                                onClick={() => onSetDefault(profile)}
                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-500)] hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-[var(--primary-500)]/20 active:scale-95"
                            >
                                Set Primary
                            </button>
                        )}
                        <a
                            href="#"
                            className="p-2 rounded-xl bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] hover:scale-110 transition-transform border border-[var(--primary-100)] dark:border-[var(--primary-900)]/30"
                            title="Download CV"
                        >
                            <Download size={18} />
                        </a>
                    </div>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden lg:flex">
                    <button
                        onClick={() => onEdit(profile)}
                        className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 text-[var(--text-secondary)] hover:text-[var(--primary-500)] shadow-xl border border-[var(--border-subtle)] transition-all hover:scale-110"
                        title="Edit Profile"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    {!profile.isDefault && (
                        <button
                            onClick={() => onDelete(profile)}
                            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 text-[var(--text-secondary)] hover:text-[var(--error-500)] shadow-xl border border-[var(--border-subtle)] transition-all hover:scale-110"
                            title="Delete Profile"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

