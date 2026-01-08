'use client';

import { useEffect, useCallback } from 'react';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;
        const altMatch = shortcut.altKey === undefined || shortcut.altKey === event.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export const defaultShortcuts: Shortcut[] = [
  // Global
  {
    key: 'k',
    metaKey: true,
    description: 'Open command palette',
    category: 'Global',
    action: () => {},
  },
  {
    key: 'n',
    metaKey: true,
    description: 'Create new item',
    category: 'Global',
    action: () => {},
  },
  {
    key: 's',
    metaKey: true,
    description: 'Save',
    category: 'Global',
    action: () => {},
  },
  {
    key: 'b',
    metaKey: true,
    description: 'Toggle sidebar',
    category: 'Global',
    action: () => {},
  },
  {
    key: '/',
    metaKey: true,
    description: 'Show shortcuts',
    category: 'Global',
    action: () => {},
  },
  {
    key: 'Escape',
    description: 'Close modal/panel',
    category: 'Global',
    action: () => {},
  },
  // Navigation
  {
    key: 'd',
    metaKey: true,
    shiftKey: true,
    description: 'Go to Dashboard',
    category: 'Navigation',
    action: () => {},
  },
  {
    key: 'p',
    metaKey: true,
    shiftKey: true,
    description: 'Go to Projects',
    category: 'Navigation',
    action: () => {},
  },
  {
    key: 's',
    metaKey: true,
    shiftKey: true,
    description: 'Go to Skills',
    category: 'Navigation',
    action: () => {},
  },
  {
    key: 'e',
    metaKey: true,
    shiftKey: true,
    description: 'Go to Education',
    category: 'Navigation',
    action: () => {},
  },
];

