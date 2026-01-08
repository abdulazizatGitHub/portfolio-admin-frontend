'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface TechData {
  name: string;
  count: number;
  color: string;
}

interface TechStackChartProps {
  data: TechData[];
}

export function TechStackChart({ data }: TechStackChartProps) {
  // Sort by count descending, take top 6
  const chartData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Projects by Technology</h3>
        <p className="card-subtitle">Top 6 technologies used</p>
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
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]} 
              barSize={32}
              animationDuration={800}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

