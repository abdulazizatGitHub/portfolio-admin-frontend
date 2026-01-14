'use client';

import React from 'react';
import {
    LayoutGrid,
    CheckCircle2,
    FileText,
    Code,
    Archive,
    type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProjectStatus } from '@/types/projects';

interface StatusFilterConfig {
    value: ProjectStatus | 'all';
    label: string;
    icon: LucideIcon;
    color: string;
    description: string;
}

const statusFilters: StatusFilterConfig[] = [
    {
        value: 'all',
        label: 'All Projects',
        icon: LayoutGrid,
        color: 'var(--text-tertiary)',
        description: 'Show all projects',
    },
    {
        value: 'live',
        label: 'Live',
        icon: CheckCircle2,
        color: '#10B981',
        description: 'Published and accessible',
    },
    {
        value: 'draft',
        label: 'Draft',
        icon: FileText,
        color: '#6B7280',
        description: 'Work in progress',
    },
    {
        value: 'development',
        label: 'Development',
        icon: Code,
        color: '#F59E0B',
        description: 'Currently being built',
    },
    {
        value: 'archived',
        label: 'Archived',
        icon: Archive,
        color: '#EF4444',
        description: 'No longer active',
    },
];

interface ProjectStatusFilterProps {
    activeStatus: ProjectStatus | 'all';
    onChange: (status: ProjectStatus | 'all') => void;
    counts: Record<ProjectStatus | 'all', number>;
}

/**
 * ProjectStatusFilter - Visual filter chips for project status
 */
export function ProjectStatusFilter({
    activeStatus,
    onChange,
    counts
}: ProjectStatusFilterProps) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {statusFilters.map((filter) => {
                const Icon = filter.icon;
                const count = counts[filter.value] || 0;
                const isActive = activeStatus === filter.value;

                return (
                    <button
                        key={filter.value}
                        onClick={() => onChange(filter.value)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all whitespace-nowrap',
                            isActive
                                ? 'border-current bg-opacity-10 font-semibold shadow-sm'
                                : 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                        )}
                        style={{
                            color: isActive ? filter.color : undefined,
                            backgroundColor: isActive ? `${filter.color}10` : undefined,
                            borderColor: isActive ? filter.color : undefined,
                        }}
                        title={filter.description}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{filter.label}</span>
                        <div
                            className={cn(
                                'flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold',
                                isActive
                                    ? 'bg-current text-white bg-opacity-100'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                            )}
                        >
                            {count}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
