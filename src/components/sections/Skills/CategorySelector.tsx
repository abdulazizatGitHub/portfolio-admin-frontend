'use client';

import React from 'react';
import {
    Code2,
    Server,
    Database,
    Cloud,
    Wrench,
    Users,
    Zap,
    Brain,
    type LucideIcon,
    Sparkles
} from 'lucide-react';
import type { SkillCategory } from '@/types/skills';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryOption {
    value: SkillCategory;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

const categoryOptions: CategoryOption[] = [
    {
        value: 'frontend',
        label: 'Interface Artisan',
        description: 'UI/UX frameworks & client architectures',
        icon: Code2,
        color: '#3B82F6',
    },
    {
        value: 'backend',
        label: 'Logic Core',
        description: 'Server paradigms & algorithmic processing',
        icon: Server,
        color: '#10B981',
    },
    {
        value: 'database',
        label: 'Data Crypt',
        description: 'Persistent storage & management systems',
        icon: Database,
        color: '#F59E0B',
    },
    {
        value: 'devops',
        label: 'Orchestration',
        description: 'Global deployment & CI/CD automation',
        icon: Cloud,
        color: '#8B5CF6',
    },
    {
        value: 'tools',
        label: 'Utility Nexus',
        description: 'Strategic tooling & workflow enhancement',
        icon: Wrench,
        color: '#EC4899',
    },
    {
        value: 'soft',
        label: 'Human Matrix',
        description: 'Collaborative leadership & synergy',
        icon: Users,
        color: '#14B8A6',
    },
    {
        value: 'technical',
        label: 'Systems Arch',
        description: 'Holistic methodologies & protocols',
        icon: Zap,
        color: '#6366F1',
    },
    {
        value: 'ai',
        label: 'Cognitive Synapse',
        description: 'Heuristic learning & neural networks',
        icon: Brain,
        color: '#F43F5E',
    },
];

interface CategorySelectorProps {
    value: SkillCategory;
    onChange: (category: SkillCategory) => void;
    error?: string;
    disabled?: boolean;
}

/**
 * CategorySelector - Premium card-based category selection for skills
 */
export function CategorySelector({
    value,
    onChange,
    error,
    disabled = false
}: CategorySelectorProps) {
    return (
        <div className="space-y-6">
            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                role="radiogroup"
                aria-label="Skill classification category"
            >
                {categoryOptions.map((option) => {
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
                                'relative group p-5 rounded-[32px] border-2 transition-all duration-300',
                                'flex flex-col items-start gap-4 text-left overflow-hidden',
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
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.15 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 -z-10"
                                        style={{ backgroundColor: option.color }}
                                    />
                                )}
                            </AnimatePresence>

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
                                        isSelected ? "text-white scale-110" : "group-hover:scale-110"
                                    )}
                                    style={{
                                        color: isSelected ? 'white' : option.color
                                    }}
                                />
                            </div>

                            {/* Label & Description */}
                            <div className="space-y-1.5 flex-1 relative z-10 w-full">
                                <div className={cn(
                                    'text-xs font-black uppercase tracking-widest transition-colors leading-tight',
                                    isSelected
                                        ? 'text-[var(--text-primary)]'
                                        : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                                )}>
                                    {option.label}
                                </div>

                                <div className={cn(
                                    'text-[9px] font-medium leading-snug transition-all duration-300',
                                    isSelected ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                                )}>
                                    {option.description}
                                </div>
                            </div>

                            {/* Active Artifact Indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-artifact"
                                    className="absolute top-4 right-4"
                                >
                                    <Sparkles size={14} className="text-[var(--text-tertiary)] opacity-50" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Error Transcript */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-[var(--error-500)] ml-2 uppercase tracking-widest"
                >
                    System Alert: {error}
                </motion.p>
            )}
        </div>
    );
}
