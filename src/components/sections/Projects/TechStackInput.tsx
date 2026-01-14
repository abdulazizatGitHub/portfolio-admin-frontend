'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { X, Plus, Terminal, Search, Sparkles } from 'lucide-react';
import { getTechSuggestions } from '@/lib/utils/projectHelpers';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface TechStackInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

/**
 * TechStackInput - Premium tag input for adding/removing technologies
 */
export function TechStackInput({
    value,
    onChange,
    placeholder = 'e.g., React, Node.js, GraphQL',
    maxTags = 15
}: TechStackInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (text: string) => {
        setInputValue(text);

        if (text.length >= 1) {
            const matchingSuggestions = getTechSuggestions(text, 6)
                .filter(tech => !value.includes(tech));
            setSuggestions(matchingSuggestions);
            setShowSuggestions(matchingSuggestions.length > 0);
            setSelectedSuggestionIndex(0);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
            onChange([...value, trimmedTag]);
            setInputValue('');
            setSuggestions([]);
            setShowSuggestions(false);
            inputRef.current?.focus();
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (showSuggestions && suggestions.length > 0) {
                addTag(suggestions[selectedSuggestionIndex]);
            } else if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        } else if (e.key === 'ArrowDown' && showSuggestions) {
            e.preventDefault();
            setSelectedSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp' && showSuggestions) {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Input Node */}
            <div className="relative group">
                <div
                    className={cn(
                        'min-h-[64px] px-5 py-3 rounded-[24px] border-2 transition-all duration-300',
                        'bg-white/[0.03] border-white/5 group-focus-within:border-[var(--primary-500)]/50 group-focus-within:bg-white/[0.05]',
                        'flex flex-wrap items-center gap-2'
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    <div className="p-2 rounded-xl bg-[var(--primary-500)]/10 text-[var(--primary-500)] mr-2">
                        <Terminal size={18} />
                    </div>

                    {/* Chips Display */}
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {value.map((tag) => (
                                <motion.div
                                    key={tag}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/20 text-[var(--primary-500)] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/5"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTag(tag);
                                        }}
                                        className="hover:bg-[var(--primary-500)] hover:text-white rounded-lg p-1 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Native Input */}
                    {value.length < maxTags && (
                        <div className="flex-1 min-w-[120px] relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder={value.length === 0 ? placeholder : ''}
                                className="w-full bg-transparent outline-none text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                            />
                        </div>
                    )}
                </div>

                {/* Heuristic Suggestions Overlay */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-[100] w-full mt-3 p-2 glass-panel rounded-[32px] border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="px-3 py-2 flex items-center justify-between border-b border-white/5 mb-2">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                    <Search size={12} />
                                    Heuristic matches
                                </div>
                                <div className="text-[9px] font-medium text-[var(--text-tertiary)] italic">Navigate with ↑↓</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => addTag(suggestion)}
                                        className={cn(
                                            'px-4 py-2.5 rounded-2xl text-left transition-all flex items-center justify-between group/item',
                                            index === selectedSuggestionIndex
                                                ? 'bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                                                : 'text-[var(--text-primary)] hover:bg-white/5'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                index === selectedSuggestionIndex ? "bg-white" : "bg-[var(--primary-500)]/40"
                                            )} />
                                            <span className="text-sm font-semibold">{suggestion}</span>
                                        </div>
                                        {index === selectedSuggestionIndex && (
                                            <motion.div layoutId="suggestion-arrow">
                                                <Sparkles size={14} className="opacity-70" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Matrix Capacity Metadata */}
            <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-medium text-[var(--text-tertiary)] leading-relaxed italic">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-sans not-italic">Enter</kbd> to integrate new node.
                </p>
                <div className={cn(
                    "text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full",
                    value.length >= maxTags ? "bg-[var(--error-500)]/10 text-[var(--error-500)]" : "bg-white/5 text-[var(--text-tertiary)]"
                )}>
                    Matrix Load: {value.length} / {maxTags}
                </div>
            </div>
        </div>
    );
}
