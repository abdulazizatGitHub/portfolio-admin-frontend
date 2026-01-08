'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      description: 'Open command palette',
      category: 'Global',
      action: () => setCommandPaletteOpen(true),
    },
    {
      key: '/',
      metaKey: true,
      description: 'Show shortcuts',
      category: 'Global',
      action: () => setShortcutsModalOpen(true),
    },
    {
      key: 'd',
      metaKey: true,
      shiftKey: true,
      description: 'Go to Dashboard',
      category: 'Navigation',
      action: () => router.push('/admin'),
    },
    {
      key: 'p',
      metaKey: true,
      shiftKey: true,
      description: 'Go to Projects',
      category: 'Navigation',
      action: () => router.push('/admin/projects'),
    },
  ]);

  return (
    <>
      <div className="flex h-screen bg-[var(--bg-secondary)]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden main-content">
          <Topbar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[var(--bg-secondary)]">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
}

