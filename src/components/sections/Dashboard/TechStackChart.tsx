'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface TechData {
  name: string;
  count: number;
  color: string;
}

interface TechStackChartProps {
  data: TechData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="recharts-default-tooltip">
        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">
          {payload[0].payload.name}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Used in {payload[0].value} projects
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function TechStackChart({ data }: TechStackChartProps) {
  const chartData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Project Technologies</h3>
        <p className="card-subtitle">Dominant tools in your portfolio</p>
      </div>

      <div className="card-body">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey="count"
              radius={[0, 10, 10, 0]}
              barSize={28}
              animationDuration={1500}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                  style={{ filter: `drop-shadow(0 0 4px ${entry.color}40)` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


