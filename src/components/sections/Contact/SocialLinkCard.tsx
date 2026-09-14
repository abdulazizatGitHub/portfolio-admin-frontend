'use client';

import React from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { getSocialIcon, getPlatformColor, formatUrlDisplay } from '@/lib/utils/contactHelpers';
import type { SocialLink } from '@/types/contact';

interface SocialLinkCardProps {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (link: SocialLink) => void;
}

/**
 * SocialLinkCard - Card for displaying social media links
 */
export function SocialLinkCard({ link, onEdit, onDelete }: SocialLinkCardProps) {
  const Icon = getSocialIcon(link.platform);
  const color = getPlatformColor(link.platform);
  const displayUrl = formatUrlDisplay(link.url, 35);

  return (
    <div className="group bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--primary-500)]/30 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{link.platform}</h3>
        </div>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(link)}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(link)}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* URL */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-tertiary)] transition-colors group/link"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-sm text-[var(--text-secondary)] truncate group-hover/link:text-[var(--primary-500)]"
          title={link.url}
        >
          {displayUrl}
        </span>
        <ExternalLink size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
      </a>
    </div>
  );
}
