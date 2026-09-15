'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  // Route protection
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

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
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-base)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 main-content relative z-10">
          <Topbar onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 scroll-smooth">
            <div key={pathname} className="route-content max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
}
