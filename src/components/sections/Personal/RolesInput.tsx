'use client';

import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RolesInputProps {
    value: string[];
    onChange: (roles: string[]) => void;
    error?: string;
}

/**
 * RolesInput - Dynamic list for managing professional roles/tags
 */
export function RolesInput({ value, onChange, error }: RolesInputProps) {
    const [inputValue, setInputValue] = React.useState('');

    const handleAddRole = () => {
        if (!inputValue.trim()) return;
        if (value.includes(inputValue.trim())) {
            setInputValue('');
            return;
        }
        onChange([...value, inputValue.trim()]);
        setInputValue('');
    };

    const handleRemoveRole = (roleToRemove: string) => {
        onChange(value.filter((role) => role !== roleToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddRole();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--text-primary)]">
                    Professional Roles
                </label>
                <span className="text-xs text-[var(--text-tertiary)]">
                    Add roles that define your profile
                </span>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Full Stack Developer"
                    className={cn(
                        'flex-1 px-4 py-2.5 rounded-lg text-sm',
                        'bg-[var(--bg-surface)] border border-[var(--border-default)]',
                        'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent',
                        'transition-all'
                    )}
                />
                <button
                    type="button"
                    onClick={handleAddRole}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-dark)]',
                        'shadow-sm active:scale-95'
                    )}
                >
                    Add
                </button>
            </div>

            {/* Roles Display Area */}
            <div className={cn(
                'flex flex-wrap gap-2 p-4 rounded-xl border-2 border-dashed min-h-[80px]',
                'bg-[var(--bg-surface)] border-[var(--border-default)]'
            )}>
                {value.length === 0 ? (
                    <p className="text-sm text-[var(--text-tertiary)] italic w-full text-center py-4">
                        No roles added yet. Type a role and press Enter or click Add.
                    </p>
                ) : (
                    value.map((role, index) => (
                        <div
                            key={role}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                                'bg-[var(--accent-light)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20',
                                'animate-in fade-in zoom-in duration-200'
                            )}
                        >
                            <span>{role}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveRole(role)}
                                className="hover:text-[var(--danger)] transition-colors p-0.5"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {error && (
                <p className="text-sm text-[var(--danger)]">{error}</p>
            )}
        </div>
    );
}
