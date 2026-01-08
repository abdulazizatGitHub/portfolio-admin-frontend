'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Info,
  GraduationCap,
  Briefcase,
  Zap,
  FolderKanban,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Personal', href: '/admin/personal', icon: User },
  { name: 'About', href: '/admin/about', icon: Info },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Zap },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Contact', href: '/admin/contact', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        aria-label={item.name}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-3 h-10 px-4 rounded-md transition-colors',
          isActive
            ? 'bg-[var(--accent-light)] text-[var(--accent-primary)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent-primary)] rounded-r" />
        )}

        {/* Icon */}
        <Icon className="w-5 h-5 flex-shrink-0" />

        {/* Label */}
        {!isCollapsed && (
          <span className="font-medium text-sm">{item.name}</span>
        )}

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm rounded border border-[var(--border-primary)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="sidebar-mobile fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] border border-[var(--border-primary)] transition-colors"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        style={{ 
          width: isCollapsed ? '72px' : '256px',
        }}
        className={cn(
          'sidebar-desktop fixed inset-y-0 left-0 z-50 transition-[width]',
          'bg-[var(--bg-surface)] border-r-2 border-[var(--border-default)]',
          'shadow-lg transition-base flex-col'
        )}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b-2 border-[var(--border-default)]">
            {isCollapsed ? (
              <div className="w-8 h-8 rounded bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            ) : (
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Admin Panel
              </h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="px-3 py-4 border-t-2 border-[var(--border-default)] space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 h-10 px-4 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <Sun className="w-5 h-5" />
              ) : theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              {!isCollapsed && (
                <span className="font-medium text-sm">Toggle Theme</span>
              )}
            </button>

            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center gap-3 h-10 px-4 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className="w-5 h-5"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-in-out' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {!isCollapsed && <span className="font-medium text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        style={{ transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        className={cn(
          'sidebar-mobile fixed inset-y-0 left-0 z-50',
          'bg-[var(--bg-surface)] border-r-2 border-[var(--border-default)]',
          'w-64 transition-transform shadow-lg flex-col'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b-2 border-[var(--border-default)]">
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Admin Panel
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 h-10 px-4 rounded-md transition-colors',
                    isActive
                      ? 'bg-[var(--accent-light)] text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="sidebar-mobile fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t-2 border-[var(--border-default)] shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full min-w-[44px]',
                  isActive
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
