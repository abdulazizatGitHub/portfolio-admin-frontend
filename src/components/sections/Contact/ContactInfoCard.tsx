'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import {
  getContactIcon,
  getContactColor,
  generateContactHref,
  copyToClipboard,
} from '@/lib/utils/contactHelpers';
import type { ContactInfoItem } from '@/types/contact';

interface ContactInfoCardProps {
  item: ContactInfoItem;
  onEdit: (item: ContactInfoItem) => void;
  onDelete: (item: ContactInfoItem) => void;
}

/**
 * ContactInfoCard - Card for displaying contact information
 */
export function ContactInfoCard({ item, onEdit, onDelete }: ContactInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = getContactIcon(item.type);
  const color = getContactColor(item.type);
  const href = item.href || generateContactHref(item.type, item.value);

  const handleCopy = async () => {
    const success = await copyToClipboard(item.value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--primary-500)]/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <span className="text-xs text-[var(--text-tertiary)] capitalize">{item.type}</span>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{item.label}</h3>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-colors ${
            copied
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Value Link */}
      <a
        href={href}
        target={item.type === 'location' ? '_blank' : undefined}
        rel={item.type === 'location' ? 'noopener noreferrer' : undefined}
        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-tertiary)] transition-colors group/link"
      >
        <span className="text-sm text-[var(--text-secondary)] truncate group-hover/link:text-[var(--primary-500)]">
          {item.value}
        </span>
        <ExternalLink size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
      </a>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--primary-500)] transition-colors text-sm"
        >
          <Edit size={14} />
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors text-sm"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
