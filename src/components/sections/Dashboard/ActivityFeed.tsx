'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'publish';
  entity: string;
  description: string;
  timestamp: Date;
  user?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'create',
    entity: 'Project',
    description: 'Created new project "E-Commerce Platform"',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
  },
  {
    id: '2',
    type: 'update',
    entity: 'Skills',
    description: 'Updated skill level for React',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
  },
  {
    id: '3',
    type: 'publish',
    entity: 'Project',
    description: 'Published project "Task Management App"',
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
  },
  {
    id: '4',
    type: 'update',
    entity: 'Education',
    description: 'Updated education entry',
    timestamp: new Date(Date.now() - 4 * 3600000), // 4 hours ago
  },
];

const activityIcons = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  publish: CheckCircle2,
};

const activityColors = {
  create: 'bg-blue-500',
  update: 'bg-yellow-500',
  delete: 'bg-red-500',
  publish: 'bg-green-500',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function ActivityFeed({
  activities = mockActivities,
  maxItems = 10,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className="h-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {displayActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const color = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white',
                      color,
                      'shadow-lg ring-2 ring-white dark:ring-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < displayActivities.length - 1 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {displayActivities.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

