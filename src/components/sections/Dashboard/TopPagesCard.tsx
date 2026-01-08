'use client';

import React from 'react';
import { FileText, TrendingUp } from 'lucide-react';

interface TopPageData {
  page: string;
  views: number;
  averageTime: number;
}

interface TopPagesCardProps {
  pages: TopPageData[];
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function TopPagesCard({ pages }: TopPagesCardProps) {
  const maxViews = Math.max(...pages.map(p => p.views));
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Top Pages</h3>
            <p className="card-subtitle">Most visited pages</p>
          </div>
          <TrendingUp className="text-[var(--text-secondary)]" size={20} />
        </div>
      </div>
      
      <div className="top-pages-list">
        {pages.map((page, index) => {
          const percentage = (page.views / maxViews) * 100;
          
          return (
            <div key={page.page} className="top-page-item">
              <div className="top-page-content">
                <div className="flex items-center gap-3">
                  <div className="top-page-rank">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="top-page-name">
                      <FileText size={14} className="inline mr-2" />
                      {page.page}
                    </div>
                    <div className="top-page-bar-container">
                      <div 
                        className="top-page-bar" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="top-page-stats">
                  <div className="top-page-stat">
                    <span className="top-page-stat-value">{page.views.toLocaleString()}</span>
                    <span className="top-page-stat-label">views</span>
                  </div>
                  <div className="top-page-stat">
                    <span className="top-page-stat-value">{formatTime(page.averageTime)}</span>
                    <span className="top-page-stat-label">avg time</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


