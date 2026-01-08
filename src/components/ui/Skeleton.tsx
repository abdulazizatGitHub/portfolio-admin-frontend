'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
}

export function Skeleton({
  width,
  height = 20,
  className,
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--bg-tertiary)]',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}
