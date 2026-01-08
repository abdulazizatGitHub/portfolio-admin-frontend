'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface SkillCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface SkillsDistributionChartProps {
  data: SkillCategory[];
}

export function SkillsDistributionChart({ data }: SkillsDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Skills Distribution</h3>
        <p className="card-subtitle">By category</p>
      </div>
      
      <div className="card-body donut-chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`donutGradient-${index}`} id={`donutGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="count"
              animationDuration={800}
              animationBegin={100}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#donutGradient-${index})`}
                  stroke="var(--bg-surface)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                `${entry.payload.category} (${entry.payload.percentage}%)`
              )}
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="donut-center-label">
          <div className="donut-center-value">{total}</div>
          <div className="donut-center-text">Total Skills</div>
        </div>
      </div>
    </div>
  );
}

