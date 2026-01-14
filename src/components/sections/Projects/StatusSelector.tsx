'use client';

import React from 'react';
import {
    CheckCircle2,
    FileText,
    Code,
    Archive,
    type LucideIcon,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProjectStatus } from '@/types/projects';
import { motion } from 'framer-motion';

interface StatusOption {
    value: ProjectStatus;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    gradient: string;
}

const statusOptions: StatusOption[] = [
    {
        value: 'live',
        label: 'Live Nexus',
        description: 'Global accessibility enabled',
        icon: CheckCircle2,
        color: '#10B981',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        value: 'draft',
        label: 'Incubation',
        description: 'Internal development only',
        icon: FileText,
        color: '#6B7280',
        gradient: 'from-slate-500 to-gray-600',
    },
    {
        value: 'development',
        label: 'In-Flight',
        description: 'Active building phase',
        icon: Code,
        color: '#F59E0B',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        value: 'archived',
        label: 'Legacy',
        description: 'Inactive archival state',
        icon: Archive,
        color: '#EF4444',
        gradient: 'from-rose-500 to-red-600',
    },
];

interface StatusSelectorProps {
    value: ProjectStatus;
    onChange: (status: ProjectStatus) => void;
    disabled?: boolean;
}

/**
 * StatusSelector - Premium status selection with glassmorphic cards
 */
export function StatusSelector({
    value,
    onChange,
    disabled = false
}: StatusSelectorProps) {
    return (
        <div className="space-y-6">
            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                role="radiogroup"
                aria-label="Project lifecycle status"
            >
                {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = value === option.value;

                    return (
                        <motion.button
                            key={option.value}
                            type="button"
                            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!disabled ? { scale: 0.98 } : {}}
                            onClick={() => !disabled && onChange(option.value)}
                            disabled={disabled}
                            role="radio"
                            aria-checked={isSelected}
                            className={cn(
                                'relative group p-5 rounded-[28px] border-2 transition-all duration-300',
                                'flex flex-col items-center gap-4 text-center overflow-hidden',
                                'disabled:opacity-40 disabled:cursor-not-allowed',
                                isSelected
                                    ? 'border-transparent shadow-xl'
                                    : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'
                            )}
                            style={{
                                background: isSelected
                                    ? `linear-gradient(135deg, ${option.color}20 0%, ${option.color}05 100%)`
                                    : undefined,
                            }}
                        >
                            {/* Selected Background Glow */}
                            {isSelected && (
                                <motion.div
                                    layoutId="status-glow"
                                    className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-20 -z-10",
                                        option.gradient
                                    )}
                                />
                            )}

                            {/* Icon Container */}
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative',
                                    isSelected
                                        ? 'shadow-lg shadow-black/10'
                                        : 'bg-white/[0.05]'
                                )}
                                style={{
                                    backgroundColor: isSelected ? option.color : undefined,
                                }}
                            >
                                <Icon
                                    size={20}
                                    className={cn(
                                        "transition-transform duration-500",
                                        isSelected ? "text-white scale-110" : "text-[var(--text-tertiary)] group-hover:scale-110"
                                    )}
                                />
                                {isSelected && (
                                    <motion.div
                                        layoutId="sparkle"
                                        className="absolute -top-1 -right-1"
                                    >
                                        <Sparkles size={12} className="text-white animate-pulse" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="space-y-1 z-10">
                                <span className={cn(
                                    'block text-[11px] font-black uppercase tracking-widest transition-colors',
                                    isSelected ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                                )}>
                                    {option.label}
                                </span>
                                <span className={cn(
                                    'block text-[9px] font-medium leading-relaxed transition-opacity h-6',
                                    isSelected ? 'text-white/70' : 'text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100'
                                )}>
                                    {option.description}
                                </span>
                            </div>

                            {/* Active Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white shadow-sm"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
