'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LucideIcon } from 'lucide-react';

const StatCardSparkline = dynamic(() => import('./StatCardSparkline'), {
  ssr: false,
  loading: () => <div className="stat-card-sparkline" style={{ height: 28 }} />,
});

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  color?: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel = 'this month',
  sparklineData = [],
  color = 'var(--primary-500)',
}: StatCardProps) {
  const hasChange = change !== undefined;
  const isPositive = change ? change > 0 : false;
  const gradientId = `gradient-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="stat-card">
      {/* Icon + Label */}
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={20} />
        </div>
        <span className="stat-card-label">{label}</span>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="stat-card-sparkline">
          <StatCardSparkline data={sparklineData} color={color} gradientId={gradientId} />
        </div>
      )}

      {/* Value */}
      <div className="stat-card-value">{value.toLocaleString()}</div>

      {/* Change Indicator */}
      {hasChange && (
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="text-xs">{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(change)}%</span>
          <span className="text-[var(--text-tertiary)] font-normal ml-1 whitespace-nowrap">
            {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
