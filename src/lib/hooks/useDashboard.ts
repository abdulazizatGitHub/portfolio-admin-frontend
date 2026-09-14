import { useQuery } from '@tanstack/react-query';
import { dashboardApi, DashboardStats } from '@/lib/api/dashboard.api';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });
}
