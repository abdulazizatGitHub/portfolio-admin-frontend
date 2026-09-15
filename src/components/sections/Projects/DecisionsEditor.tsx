'use client';

import React from 'react';
import { Plus, Trash2, MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { DecisionEntry } from '@/types/projects';

interface DecisionsEditorProps {
  value: DecisionEntry[];
  onChange: (decisions: DecisionEntry[]) => void;
  maxDecisions?: number;
}

const QUESTION_MAX = 100;
const ANSWER_MAX = 300;

/**
 * DecisionsEditor - add/edit/remove "why this approach" Q&A entries shown
 * in the public site's Decision Log panel on featured project cards.
 */
export function DecisionsEditor({ value, onChange, maxDecisions = 8 }: DecisionsEditorProps) {
  const addDecision = () => {
    if (value.length >= maxDecisions) return;
    onChange([...value, { question: '', answer: '' }]);
  };

  const removeDecision = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateDecision = (index: number, field: keyof DecisionEntry, text: string) => {
    onChange(value.map((d, i) => (i === index ? { ...d, [field]: text } : d)));
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {value.map((decision, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/40 space-y-3"
          >
            <button
              type="button"
              onClick={() => removeDecision(index)}
              aria-label={`Remove decision ${index + 1}`}
              className="absolute top-3 right-3 p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--error-500)] hover:bg-[var(--error-500)]/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Question
              </label>
              <input
                type="text"
                value={decision.question}
                onChange={(e) => updateDecision(index, 'question', e.target.value)}
                maxLength={QUESTION_MAX}
                placeholder='e.g. "Why PostgreSQL over MongoDB?"'
                className="w-full h-9 px-3 pr-8 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Answer
              </label>
              <textarea
                value={decision.answer}
                onChange={(e) => updateDecision(index, 'answer', e.target.value)}
                maxLength={ANSWER_MAX}
                rows={2}
                placeholder="One specific sentence — the actual reason, not a technology name."
                className="w-full px-3 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20 resize-none"
              />
              <div className="mt-1 text-right text-[10px] text-[var(--text-tertiary)]">
                {decision.answer.length} / {ANSWER_MAX}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {value.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-6 rounded-lg border border-dashed border-[var(--border-subtle)] text-[var(--text-tertiary)] text-sm">
          <MessageCircleQuestion size={16} />
          No decisions yet. Add at least 3 for featured projects — see CONTENT.md for the quality
          bar.
        </div>
      )}

      <button
        type="button"
        onClick={addDecision}
        disabled={value.length >= maxDecisions}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed text-sm font-medium transition-colors',
          value.length >= maxDecisions
            ? 'border-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed opacity-50'
            : 'border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10'
        )}
      >
        <Plus size={16} />
        Add decision
      </button>

      <div className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
        {value.length} / {maxDecisions}
      </div>
    </div>
  );
}
