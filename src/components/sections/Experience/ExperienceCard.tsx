'use client';

import React from 'react';
import { Edit, Trash2, MapPin, Briefcase, Calendar, Sparkles, Clock, Globe } from 'lucide-react';
import {
    getDateRange,
    calculateDuration,
    calculateTotalDuration,
    calculateOverallPeriod,
    isCurrentExperience,
    sortRoles
} from '@/lib/utils/experienceHelpers';
import type { ExperienceEntry } from '@/types/experience';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface ExperienceCardProps {
    entry: ExperienceEntry;
    onEdit: (entry: ExperienceEntry) => void;
    onDelete: (entry: ExperienceEntry) => void;
}

/**
 * ExperienceCard - Premium timeline-style card showing organization and all roles
 */
export function ExperienceCard({ entry, onEdit, onDelete }: ExperienceCardProps) {
    const isCurrent = isCurrentExperience(entry);
    const overallPeriod = calculateOverallPeriod(entry);
    const totalDuration = calculateTotalDuration(entry);
    const sortedRoles = sortRoles(entry.roles || []);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                'card p-8 md:p-10 relative overflow-hidden group',
                isCurrent && 'ring-2 ring-[var(--primary-500)]/30 shadow-[0_0_30px_rgba(var(--primary-500-rgb),0.1)]'
            )}
        >
            {/* Background Mesh for Active Nodes */}
            {isCurrent && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-500)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            )}

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                            className={cn(
                                "w-16 h-16 rounded-[28px] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-2xl transition-transform duration-500",
                                isCurrent
                                    ? "bg-[var(--primary-500)] text-white shadow-xl shadow-[var(--primary-500)]/30"
                                    : "bg-white/5 text-[var(--text-tertiary)] group-hover:bg-white/10 group-hover:text-[var(--text-secondary)]"
                            )}>
                            <Globe size={32} />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                                    {entry.organization}
                                </h3>
                                {isCurrent && (
                                    <div
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Current</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                {entry.location && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                                        <MapPin className="w-3 h-3 text-[var(--text-tertiary)]" />
                                        <span>{entry.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--primary-500)] uppercase tracking-[0.15em]">
                                    <Calendar className="w-3 h-3" />
                                    <span>{overallPeriod}</span>
                                    <span className="text-[var(--text-tertiary)] opacity-50 px-1">|</span>
                                    <Clock className="w-3 h-3" />
                                    <span>{totalDuration} Total</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(entry)}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-tertiary)] hover:bg-[var(--primary-500)] hover:text-white hover:border-transparent transition-all duration-300 active:scale-95 group/btn"
                        aria-label={`Edit ${entry.organization}`}
                    >
                        <Edit size={18} className="group-hover/btn:scale-110" />
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-300 active:scale-95 group/btn"
                        aria-label={`Delete ${entry.organization}`}
                    >
                        <Trash2 size={18} className="group-hover/btn:rotate-12" />
                    </button>
                </div>
            </div>

            {/* Role Timeline */}
            <div className="relative space-y-12 mt-8">
                {/* Timeline Axis */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />

                {sortedRoles.map((role, index) => {
                    const dateRange = getDateRange(role.startDate, role.endDate, role.isCurrent);
                    const duration = calculateDuration(role.startDate, role.endDate);

                    return (
                        <div key={role.id} className="relative pl-12 group/role">
                            {/* Role Node Point */}
                            <div className={cn(
                                "absolute left-2 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10",
                                role.isCurrent
                                    ? "bg-[var(--primary-500)] border-[var(--primary-500)] shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.5)]"
                                    : "bg-[var(--bg-dark)] border-white/20 group-hover/role:border-white/40"
                            )}>
                                {role.isCurrent && (
                                    <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-white animate-pulse" />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className={cn(
                                            "text-lg font-bold uppercase tracking-tight transition-colors",
                                            role.isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                                        )}>
                                            {role.jobTitle}
                                        </h4>
                                        {role.isCurrent && (
                                            <Sparkles size={10} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                                        <span>{dateRange}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span>{duration}</span>
                                    </div>
                                </div>

                                {role.description && (
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover/role:bg-white/[0.03] transition-colors">
                                        <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                            {role.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
    );
}
