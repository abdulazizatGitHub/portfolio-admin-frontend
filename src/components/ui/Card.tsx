'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg transition-colors',
        (onClick || hover) && 'cursor-pointer hover:border-[var(--accent-primary)]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-[var(--border-primary)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-[var(--border-primary)]',
        className
      )}
    >
      {children}
    </div>
  );
}
