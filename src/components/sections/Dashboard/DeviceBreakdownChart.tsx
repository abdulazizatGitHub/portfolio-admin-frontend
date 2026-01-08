'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface DeviceData {
  device: 'desktop' | 'mobile' | 'tablet';
  count: number;
  percentage: number;
}

interface DeviceBreakdownChartProps {
  data: DeviceData[];
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const deviceColors = {
  desktop: 'var(--chart-2)',
  mobile: 'var(--chart-3)',
  tablet: 'var(--chart-4)',
};

export function DeviceBreakdownChart({ data }: DeviceBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Add colors to data
  const chartData = data.map(item => ({
    ...item,
    color: deviceColors[item.device],
    name: item.device.charAt(0).toUpperCase() + item.device.slice(1)
  }));
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Device Breakdown</h3>
        <p className="card-subtitle">Visitor devices</p>
      </div>
      
      <div className="card-body">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`deviceGradient-${index}`} id={`deviceGradient-${entry.device}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
              animationDuration={800}
              animationBegin={200}
            >
              {chartData.map((entry) => (
                <Cell 
                  key={`cell-${entry.device}`}
                  fill={`url(#deviceGradient-${entry.device})`}
                  stroke="var(--bg-surface)"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toLocaleString()} (${props.payload.percentage}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Device Stats Below Chart */}
        <div className="device-stats-grid">
          {chartData.map((item) => {
            const Icon = deviceIcons[item.device];
            return (
              <div key={item.device} className="device-stat-item">
                <div className="device-stat-icon" style={{ color: item.color }}>
                  <Icon size={20} />
                </div>
                <div className="device-stat-info">
                  <div className="device-stat-label">{item.name}</div>
                  <div className="device-stat-value">
                    {item.percentage}%
                    <span className="device-stat-count">({item.count.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


