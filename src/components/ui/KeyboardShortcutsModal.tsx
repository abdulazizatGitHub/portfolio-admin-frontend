'use client';

import React from 'react';
import { Modal } from './Modal';
import { defaultShortcuts, type Shortcut } from '@/lib/hooks/useKeyboardShortcuts';
import { Command } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: Shortcut[];
}

function getKeyDisplay(shortcut: Shortcut): string {
  const parts: string[] = [];
  if (shortcut.metaKey) parts.push('⌘');
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('⇧');
  if (shortcut.altKey) parts.push('⌥');
  parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase());
  return parts.join(' + ');
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts = defaultShortcuts,
}: KeyboardShortcutsModalProps) {
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const category = shortcut.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="space-y-6">
        {Object.entries(groupedShortcuts).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                    {getKeyDisplay(shortcut)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded ml-1">/</kbd> to open this dialog
        </p>
      </div>
    </Modal>
  );
}

