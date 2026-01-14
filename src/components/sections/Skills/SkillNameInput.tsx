'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import {
    normalizeSkillName,
    getSkillSuggestions,
    isSkillDuplicate,
    validateSkillName
} from '@/lib/utils/skillHelpers';
import { cn } from '@/lib/utils/cn';

interface SkillNameInputProps {
    value: string;
    onChange: (value: string) => void;
    existingSkills?: string[];
    error?: string;
    disabled?: boolean;
}

/**
 * SkillNameInput - Smart input with auto-suggest, normalization, and duplicate detection
 */
export function SkillNameInput({
    value,
    onChange,
    existingSkills = [],
    error,
    disabled = false
}: SkillNameInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Check for duplicate
    const isDuplicate = value && isSkillDuplicate(value, existingSkills);

    // Get normalized version
    const normalized = value ? normalizeSkillName(value) : '';
    const showNormalization = value && normalized !== value;

    // Update suggestions when value changes
    useEffect(() => {
        if (value && value.length >= 2) {
            const matches = getSkillSuggestions(value, 5);
            setSuggestions(matches);
            setSelectedIndex(-1);
        } else {
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    }, [value]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    // Handle normalization acceptance
    const handleAcceptNormalization = () => {
        onChange(normalized);
    };

    return (
        <div className="space-y-3">
            {/* Label */}
            <label
                htmlFor="skill-name"
                className="block text-sm font-medium text-[var(--text-primary)]"
            >
                Skill Name
                <span className="text-[var(--danger)] ml-1">*</span>
            </label>

            {/* Input Container */}
            <div className="relative">
                <input
                    ref={inputRef}
                    id="skill-name"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        // Delay to allow clicking suggestions
                        setTimeout(() => setIsFocused(false), 200);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder="e.g., React, TypeScript, PostgreSQL"
                    className={cn(
                        'w-full h-11 px-4 rounded-xl border transition-all duration-200 premium-input',
                        'placeholder:text-[var(--text-tertiary)] placeholder:font-medium',
                        'disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
                        error || isDuplicate
                            ? 'border-[var(--error-500)] focus:border-[var(--error-500)]'
                            : 'border-[var(--border-subtle)] focus:border-[var(--primary-500)]'
                    )}
                    aria-invalid={error || isDuplicate ? true : undefined}
                    aria-describedby={error ? 'skill-name-error' : undefined}
                />

                {/* Auto-Suggest Dropdown */}
                {isFocused && suggestions.length > 0 && (
                    <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-3 py-2 glass-panel shadow-2xl rounded-2xl border border-[var(--border-subtle)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                        role="listbox"
                    >
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className={cn(
                                    'w-full px-5 py-3 text-left text-sm transition-all',
                                    'flex items-center justify-between gap-2',
                                    index === selectedIndex
                                        ? 'bg-[var(--primary-500)] text-white'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--primary-500)] hover:text-white'
                                )}
                                role="option"
                                aria-selected={index === selectedIndex}
                            >
                                <span className="font-bold tracking-tight">{suggestion}</span>
                                {(index === selectedIndex) && (
                                    <Check className="w-4 h-4 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Normalization Suggestion */}
            {showNormalization && !isDuplicate && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--primary-500)]/5 border border-[var(--primary-500)]/10">
                    <div className="flex-1 text-xs font-medium">
                        <span className="text-[var(--text-secondary)]">Standardize to: </span>
                        <button
                            type="button"
                            onClick={handleAcceptNormalization}
                            className="font-black text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline decoration-2 underline-offset-2"
                        >
                            {normalized}
                        </button>
                    </div>
                </div>
            )}

            {/* Duplicate Warning */}
            {isDuplicate && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--warning-500)]/5 border border-[var(--warning-500)]/20">
                    <div className="p-2 rounded-xl bg-[var(--warning-500)]/10 text-[var(--warning-600)]">
                        <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1 text-xs">
                        <p className="font-black text-[var(--warning-700)] dark:text-[var(--warning-400)] uppercase tracking-widest">
                            Duplicate record detected
                        </p>
                        <p className="text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
                            This acquisition already exists in your technical arsenal. Updating the existing record is recommended.
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p
                    id="skill-name-error"
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--error-500)] flex items-center gap-2"
                    role="alert"
                >
                    <AlertTriangle size={12} />
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {!error && !isDuplicate && (
                <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic px-1">
                    This designated label will be manifested on your public exposition.
                </p>
            )}
        </div>
    );
}
