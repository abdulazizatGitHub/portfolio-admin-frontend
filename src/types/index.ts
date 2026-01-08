export * from './personal';
export * from './about';
export * from './education';
export * from './experience';
export * from './skills';
export * from './projects';
export * from './contact';
export * from './auth';

// Activity Log Type
export interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'project' | 'skill' | 'education' | 'experience' | 'profile';
  entityId: string;
  entityName: string;
  description: string;
  timestamp: string;
}

// Website Analytics Types
export interface WebsiteAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  cvDownloads: number;
  averageSessionDuration: number; // in seconds
  bounceRate: number; // percentage
  visitTrend: VisitTrendData[];
  topPages: TopPageData[];
  deviceBreakdown: DeviceData[];
  trafficSources: TrafficSourceData[];
}

export interface VisitTrendData {
  date: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
}

export interface TopPageData {
  page: string;
  views: number;
  averageTime: number; // in seconds
}

export interface DeviceData {
  device: 'desktop' | 'mobile' | 'tablet';
  count: number;
  percentage: number;
}

export interface TrafficSourceData {
  source: string;
  visits: number;
  percentage: number;
}

