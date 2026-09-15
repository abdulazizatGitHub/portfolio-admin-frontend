'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardSparklineProps {
  data: number[];
  color: string;
  gradientId: string;
}

export function StatCardSparkline({ data, color, gradientId }: StatCardSparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={28}>
      <AreaChart data={data.map((val, index) => ({ val, index }))}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="val"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default StatCardSparkline;
