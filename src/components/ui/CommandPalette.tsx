'use client';

import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  User,
  Info,
  GraduationCap,
  Briefcase,
  Zap,
  FolderKanban,
  Mail,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  keywords?: string[];
  group: string;
}

const commands: CommandItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Go to dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    keywords: ['dashboard', 'home', 'main'],
    group: 'Navigation',
  },
  {
    id: 'personal',
    label: 'Personal',
    description: 'Manage personal information',
    icon: User,
    href: '/admin/personal',
    keywords: ['personal', 'profile', 'info'],
    group: 'Navigation',
  },
  {
    id: 'about',
    label: 'About',
    description: 'Edit about section',
    icon: Info,
    href: '/admin/about',
    keywords: ['about', 'bio'],
    group: 'Navigation',
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Manage education entries',
    icon: GraduationCap,
    href: '/admin/education',
    keywords: ['education', 'school', 'degree'],
    group: 'Navigation',
  },
  {
    id: 'experience',
    label: 'Experience',
    description: 'Manage work experience',
    icon: Briefcase,
    href: '/admin/experience',
    keywords: ['experience', 'work', 'job', 'career'],
    group: 'Navigation',
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'Update skills and levels',
    icon: Zap,
    href: '/admin/skills',
    keywords: ['skills', 'abilities', 'technologies'],
    group: 'Navigation',
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Manage portfolio projects',
    icon: FolderKanban,
    href: '/admin/projects',
    keywords: ['projects', 'portfolio', 'work'],
    group: 'Navigation',
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Update contact information',
    icon: Mail,
    href: '/admin/contact',
    keywords: ['contact', 'email', 'phone'],
    group: 'Navigation',
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setSearch('');
    }
  }, [open]);

  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  });

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleSelect = (command: CommandItem) => {
    if (command.href) {
      router.push(command.href);
    }
    if (command.action) {
      command.action();
    }
    onOpenChange(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        style={{ opacity: open ? 1 : 0 }}
        onClick={() => onOpenChange(false)}
      />

      {/* Command Palette */}
      <div
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 transition-all"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 0) scale(0.98)',
        }}
      >
        <Command className="bg-[var(--bg-elevated)] rounded-lg shadow-lg border border-[var(--border-primary)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 border-b border-[var(--border-primary)]">
            <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 h-14 bg-transparent border-0 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              autoFocus
            />
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([group, items]) => (
              <React.Fragment key={group}>
                <Command.Group
                  heading={group}
                  className="px-2 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                >
                  {items.map((command) => {
                    const Icon = command.icon;
                    return (
                      <Command.Item
                        key={command.id}
                        value={command.id}
                        onSelect={() => handleSelect(command)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer',
                          'text-[var(--text-primary)]',
                          'hover:bg-[var(--bg-tertiary)]',
                          'data-[selected=true]:bg-[var(--bg-tertiary)]',
                          'transition-colors'
                        )}
                      >
                        <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                        <div className="flex-1">
                          <div className="font-medium">{command.label}</div>
                          {command.description && (
                            <div className="text-sm text-[var(--text-secondary)]">
                              {command.description}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </React.Fragment>
            ))}

            {filteredCommands.length === 0 && (
              <div className="px-4 py-12 text-center text-[var(--text-secondary)]">
                No results found
              </div>
            )}
          </Command.List>

          <div className="px-4 py-2 border-t border-[var(--border-primary)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
            <span>Navigate with arrow keys</span>
            <span>Press Enter to select, Esc to close</span>
          </div>
        </Command>
      </div>
    </>
  );
}
