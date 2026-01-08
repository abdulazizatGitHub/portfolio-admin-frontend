'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Globe, Search, Github, Linkedin, Twitter } from 'lucide-react';

interface TrafficSourceData {
  source: string;
  visits: number;
  percentage: number;
}

interface TrafficSourcesChartProps {
  data: TrafficSourceData[];
}

const sourceIcons: Record<string, React.ElementType> = {
  'Direct': Globe,
  'Google': Search,
  'GitHub': Github,
  'LinkedIn': Linkedin,
  'Twitter': Twitter,
};

export function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  const maxVisits = Math.max(...data.map(d => d.visits));
  
  // Add colors to data
  const chartData = data.map((item, index) => ({
    ...item,
    color: `var(--chart-${(index % 6) + 1})`
  }));
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Traffic Sources</h3>
        <p className="card-subtitle">Where visitors come from</p>
      </div>
      
      <div className="card-body">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`sourceGradient-${index}`} id={`sourceGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={entry.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="source"
              width={90}
              tick={{ fill: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}
              axisLine={false}
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
              formatter={(value: number, name: string, props: any) => [
                `${value.toLocaleString()} visits (${props.payload.percentage}%)`,
                'Visits'
              ]}
              cursor={{ fill: 'var(--bg-hover)', opacity: 0.5 }}
            />
            <Bar 
              dataKey="visits" 
              radius={[0, 8, 8, 0]} 
              barSize={28}
              animationDuration={800}
              animationBegin={100}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#sourceGradient-${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Source Details */}
        <div className="traffic-sources-list">
          {chartData.map((item) => {
            const Icon = sourceIcons[item.source] || Globe;
            const percentage = (item.visits / maxVisits) * 100;
            
            return (
              <div key={item.source} className="traffic-source-item">
                <div className="traffic-source-header">
                  <div className="traffic-source-icon" style={{ color: item.color }}>
                    <Icon size={16} />
                  </div>
                  <span className="traffic-source-name">{item.source}</span>
                  <span className="traffic-source-percentage">{item.percentage}%</span>
                </div>
                <div className="traffic-source-bar-container">
                  <div 
                    className="traffic-source-bar" 
                    style={{ 
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color})`
                    }}
                  />
                </div>
                <div className="traffic-source-count">
                  {item.visits.toLocaleString()} visits
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


