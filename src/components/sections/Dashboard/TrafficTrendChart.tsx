'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VisitTrendData {
  date: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
}

interface TrafficTrendChartProps {
  data: VisitTrendData[];
}

export function TrafficTrendChart({ data }: TrafficTrendChartProps) {
  // Format date for display (show last 7 days with full dates, others just day)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // Only show every 5th label to avoid crowding
  const chartData = data.map((item, index) => ({
    ...item,
    displayDate: index % 5 === 0 ? formatDate(item.date) : '',
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Website Traffic Trend</h3>
        <p className="card-subtitle">Last 30 days</p>
      </div>
      
      <div className="card-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary-500)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--primary-500)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--secondary-500)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--secondary-500)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-default)" 
              opacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke="var(--text-tertiary)"
              fontSize={12}
              tick={{ fill: 'var(--text-secondary)', fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={12}
              tick={{ fill: 'var(--text-secondary)', fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px'
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return formatDate(payload[0].payload.date);
                }
                return label;
              }}
              cursor={{ stroke: 'var(--primary-500)', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px', fontWeight: 500 }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="visits"
              name="Total Visits"
              stroke="var(--primary-500)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--bg-surface)' }}
              fill="url(#visitGradient)"
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="uniqueVisitors"
              name="Unique Visitors"
              stroke="var(--secondary-500)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--bg-surface)' }}
              fill="url(#visitorGradient)"
              animationDuration={1000}
              animationBegin={200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

