import api from './api';

export interface DashboardStats {
  growthAnalytics: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    cvDownloads: number;
  };
  visitTrend: Array<{ date: string; visits: number; uniqueVisitors: number; pageViews: number }>;
  contentVelocity: {
    projects: number;
    skills: number;
    experience: number;
    education: number;
  };
  deepInsights: {
    techStack: Array<{ name: string; count: number }>;
    topPages: Array<{ path: string; views: number }>;
    deviceBreakdown: Array<{ device: string; count: number }>;
    trafficSources: Array<{ source: string; visits: number; percentage: number }>;
  };
  recentActivities: Array<{
    id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    entity_name: string | null;
    description: string;
    created_at: string;
  }>;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  },
};
