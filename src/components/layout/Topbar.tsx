'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  HelpCircle,
  User,
  LogOut,
  Settings,
  Home,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/contexts/ThemeContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/personal': 'Personal Information',
  '/admin/about': 'About Content',
  '/admin/education': 'Education',
  '/admin/experience': 'Experience',
  '/admin/skills': 'Skills',
  '/admin/projects': 'Projects',
  '/admin/contact': 'Contact Information',
};

const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/admin' }];

  if (parts.length > 1) {
    const currentLabel = pageTitles[pathname] || parts[parts.length - 1];
    breadcrumbs.push({ label: currentLabel, href: pathname });
  }

  return breadcrumbs;
};

export function Topbar({ onCommandPaletteOpen }: { onCommandPaletteOpen?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const currentTitle = pageTitles[pathname] || 'Admin Panel';
  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      onCommandPaletteOpen?.();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCommandPaletteOpen]);

  return (
    <header
      className={cn(
        'h-16 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]',
        'flex items-center justify-between px-6 sticky top-0 z-30 transition-colors',
        isScrolled && 'shadow-sm'
      )}
    >
      {/* Left Section - Breadcrumbs & Title */}
      <div className="flex items-center gap-4 flex-1">
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && (
                <span className="text-[var(--text-tertiary)]">/</span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-[var(--text-primary)]">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => router.push(crumb.href)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title (Mobile) */}
        <h2 className="text-xl font-bold md:hidden text-[var(--text-primary)]">
          {currentTitle}
        </h2>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onCommandPaletteOpen}
          className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm hidden lg:inline">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button
            className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full border-2 border-[var(--bg-primary)]" />
          </button>

          {/* Help */}
          <button
            className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <Sun className="w-5 h-5" />
            ) : theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="ml-2 h-8 w-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-medium text-sm cursor-pointer"
                aria-label="User menu"
              >
                <User className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-[var(--bg-elevated)] rounded-lg shadow-lg border border-[var(--border-primary)] p-2 z-50"
                sideOffset={5}
              >
                <DropdownMenu.Item className="px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--text-primary)] transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--text-primary)] transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-[var(--border-primary)] my-1" />
                <DropdownMenu.Item className="px-3 py-2 rounded-md hover:bg-[var(--danger-bg)] cursor-pointer outline-none flex items-center gap-2 text-sm text-[var(--danger)] transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
