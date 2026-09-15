'use client';

import React from 'react';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/skillHelpers';
import type { Skill, SkillCategory } from '@/types/skills';
import { cn } from '@/lib/utils/cn';

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  isDragging?: boolean;
}

// Use hex colors instead of CSS variables for gradient support
const categoryColors: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  frontend: { bg: '#5B93FF', text: '#5B93FF', border: '#5B93FF' }, // Blue
  backend: { bg: '#0ac49bff', text: '#5DCCB4', border: '#5DCCB4' }, // Teal
  database: { bg: '#8B5CF6', text: '#8B5CF6', border: '#8B5CF6' }, // Purple
  devops: { bg: '#F59E0B', text: '#F59E0B', border: '#F59E0B' }, // Yellow/Orange
  tools: { bg: '#EC4899', text: '#EC4899', border: '#EC4899' }, // Pink
  soft: { bg: '#10B981', text: '#10B981', border: '#10B981' }, // Green
  technical: { bg: '#6366F1', text: '#6366F1', border: '#6366F1' }, // Indigo
  ai: { bg: '#8B5CF6', text: '#8B5CF6', border: '#8B5CF6' }, // Violet
};

import { motion } from 'framer-motion';

/**
 * SkillCard - Enhanced visual card for displaying skills with proficiency
 */
export function SkillCard({ skill, onEdit, onDelete, isDragging = false }: SkillCardProps) {
  const levelLabel = getLevelLabel(skill.level);
  const categoryColor = categoryColors[skill.category] || categoryColors.technical;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group relative p-4 rounded-xl bg-[var(--bg-surface)] border',
        'border-[var(--border-subtle)] hover:border-[var(--primary-500)]/30 transition-all duration-150',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      {/* Header Row: Name + Level Badge + Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
            {skill.name}
          </h3>
        </div>

        {/* Level Badge */}
        <div
          className="px-2 py-0.5 rounded text-[10px] font-medium uppercase border flex-shrink-0"
          style={{
            backgroundColor: `${categoryColor.bg}15`,
            color: categoryColor.text,
            borderColor: `${categoryColor.text}30`,
          }}
        >
          {levelLabel}
        </div>

        {/* Actions - Visible on Hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(skill)}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-colors"
            aria-label={`Edit ${skill.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(skill)}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label={`Delete ${skill.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-tertiary)]">Proficiency</span>
          <span style={{ color: categoryColor.text }}>{skill.level}%</span>
        </div>
        <div className="relative h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ backgroundColor: categoryColor.bg }}
          />
        </div>
      </div>
    </motion.div>
  );
}
