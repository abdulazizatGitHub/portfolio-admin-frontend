'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">
        {/* Global Dynamic Mesh Background */}
        <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[var(--primary-300)]/30 to-transparent blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--secondary-300)]/20 to-transparent blur-[140px]" />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[var(--primary-200)]/15 to-transparent blur-[80px]" />
        </div>

        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 main-content relative z-10">
          <Topbar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[1600px] mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
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


