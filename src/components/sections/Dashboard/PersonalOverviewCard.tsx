'use client';

import React from 'react';
import { User, Globe, FileCheck } from 'lucide-react';
import { usePersonalContent } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

export function PersonalOverviewCard() {
  const { data: profile, isLoading } = usePersonalContent();

  if (isLoading) {
    return (
      <div className="card h-full min-h-[300px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)]">
        <User size={48} className="mb-4 opacity-20" />
        <p>No primary profile found. Set a default profile in the Personal section.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
        <div
          className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl shrink-0 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center"
          aria-hidden="true"
        >
          <User size={44} className="text-[var(--text-tertiary)]" />
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">
              {profile.name}
            </h1>
            <Badge variant="info">Primary Profile</Badge>
          </div>

          <p className="text-base lg:text-lg text-[var(--text-secondary)] mb-4">
            {profile.titlePrefix} <span className="font-semibold">{profile.roles?.[0]}</span>.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Globe size={16} /> Worldwide
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck size={16} /> Verified Profile
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--success-500)]" /> Available for Work
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            {profile.roles?.map((role: string) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
