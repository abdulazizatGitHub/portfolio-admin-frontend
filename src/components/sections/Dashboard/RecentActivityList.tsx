'use client';

import React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'project' | 'skill' | 'education' | 'experience' | 'profile';
  entityName: string;
  timestamp: string;
  description: string;
}

interface RecentActivityListProps {
  activities: Activity[];
  maxItems?: number;
  onViewAll?: () => void;
}

const activityIcons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
};

const activityColors = {
  create: 'var(--success-500)',
  update: 'var(--info-500)',
  delete: 'var(--error-500)',
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

export function RecentActivityList({
  activities,
  maxItems = 5,
  onViewAll
}: RecentActivityListProps) {
  const displayedActivities = activities.slice(0, maxItems);
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Activity</h3>
        <p className="card-subtitle">Last {maxItems} actions</p>
      </div>
      
      <div className="activity-list">
        {displayedActivities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const color = activityColors[activity.type];
          
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon" style={{ color }}>
                <Icon size={16} />
              </div>
              
              <div className="activity-content">
                <div className="activity-description">{activity.description}</div>
                <div className="activity-meta">
                  <span className="activity-entity">{activity.entityName}</span>
                  <span className="activity-separator">·</span>
                  <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {onViewAll && activities.length > maxItems && (
        <div className="card-footer">
          <button onClick={onViewAll} className="btn-ghost btn-sm">
            View All Activity →
          </button>
        </div>
      )}
    </div>
  );
}


