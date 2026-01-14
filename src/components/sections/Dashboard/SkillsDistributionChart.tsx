'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SkillCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface SkillsDistributionChartProps {
  data: SkillCategory[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="recharts-default-tooltip">
        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">
          {data.category}
        </p>
        <p className="text-xs font-medium text-[var(--text-secondary)]">
          {data.count} Skills ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function SkillsDistributionChart({ data }: SkillsDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Category Balance</h3>
        <p className="card-subtitle">Diversity of your expertise</p>
      </div>

      <div className="card-body donut-chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`donutGradient-${index}`} id={`donutGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="count"
              animationDuration={1500}
              animationBegin={100}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#donutGradient-${index})`}
                  stroke="none"
                  style={{
                    filter: `drop-shadow(0 4px 8px ${entry.color}30)`,
                    outline: 'none'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {entry.payload.category}
                </span>
              )}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="donut-center-label">
          <div className="donut-center-value" style={{ color: 'var(--primary-500)' }}>{total}</div>
          <div className="donut-center-text text-[10px] font-bold uppercase tracking-widest opacity-60">Total</div>
        </div>
      </div>
    </div>
  );
}


