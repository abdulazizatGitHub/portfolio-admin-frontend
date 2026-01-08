'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  color?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel = 'this month',
  sparklineData = [],
  color = 'var(--primary-500)'
}: StatCardProps) {
  const hasChange = change !== undefined;
  const isPositive = change ? change > 0 : false;
  
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
          <ResponsiveContainer width="100%" height={24}>
            <AreaChart data={sparklineData.map((value, index) => ({ value, index }))}>
              <defs>
                <linearGradient id={`gradient-${label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${label.replace(/\s+/g, '-')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Value */}
      <div className="stat-card-value">{value}</div>
      
      {/* Change Indicator */}
      {hasChange && (
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change!)}% {changeLabel}
        </div>
      )}
    </div>
  );
}

