'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

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
  delay = 0
}: StatCardProps) {
  const hasChange = change !== undefined;
  const isPositive = change ? change > 0 : false;
  const gradientId = `gradient-${label.replace(/\s+/g, '-')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="stat-card"
    >
      {/* Icon + Label */}
      <div className="stat-card-header">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="stat-card-icon"
        >
          <Icon size={24} />
        </motion.div>
        <span className="stat-card-label">{label}</span>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="stat-card-sparkline">
          <ResponsiveContainer width="100%" height={32}>
            <AreaChart data={sparklineData.map((val, index) => ({ val, index }))}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                isAnimationActive={true}
                animationDuration={1500}
                style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Value */}
      <div className="stat-card-value">{value.toLocaleString()}</div>

      {/* Change Indicator */}
      {hasChange && (
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="text-xs">{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(change)}%</span>
          <span className="text-[var(--text-tertiary)] font-normal ml-1 whitespace-nowrap">{changeLabel}</span>
        </div>
      )}
    </motion.div>
  );
}


