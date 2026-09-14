'use client';

import {
  useEducation,
  useExperience,
  useProjects,
  useSkills,
  useDashboardStats,
} from '@/lib/hooks';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  FolderOpen,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Eye,
  MousePointerClick,
  Download,
} from 'lucide-react';
import { StatCard } from '@/components/sections/Dashboard/StatCard';
import { TechStackChart } from '@/components/sections/Dashboard/TechStackChart';
import { SkillsDistributionChart } from '@/components/sections/Dashboard/SkillsDistributionChart';
import { RecentActivityList } from '@/components/sections/Dashboard/RecentActivityList';
import { QuickActionsPanel } from '@/components/sections/Dashboard/QuickActionsPanel';
import { TrafficTrendChart } from '@/components/sections/Dashboard/TrafficTrendChart';
import { TopPagesCard } from '@/components/sections/Dashboard/TopPagesCard';
import { DeviceBreakdownChart } from '@/components/sections/Dashboard/DeviceBreakdownChart';
import { TrafficSourcesChart } from '@/components/sections/Dashboard/TrafficSourcesChart';
import { PersonalOverviewCard } from '@/components/sections/Dashboard/PersonalOverviewCard';
import { useRouter } from 'next/navigation';
import type { Activity, DeviceData, TopPageData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: experience, isLoading: experienceLoading } = useExperience();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const isLoading =
    projectsLoading || skillsLoading || educationLoading || experienceLoading || statsLoading;

  // Calculate tech stack distribution
  const getTechStackData = () => {
    if (!projects) return [];

    const techCount: Record<string, number> = {};
    projects.forEach((project) => {
      project.techStack?.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    return Object.entries(techCount).map(([name, count], index) => ({
      name,
      count,
      color: getChartColor(index),
    }));
  };

  // Calculate skills distribution
  const getSkillsDistribution = () => {
    if (!skills) return [];

    const categoryCount: Record<string, number> = {
      frontend: 0,
      backend: 0,
      database: 0,
      devops: 0,
      tools: 0,
      soft: 0,
      technical: 0,
      ai: 0,
    };

    skills.forEach((skill) => {
      if (skill.category in categoryCount) {
        categoryCount[skill.category]++;
      }
    });

    const total = skills.length;
    return Object.entries(categoryCount)
      .filter(([_, count]) => count > 0)
      .map(([category, count], index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: getChartColor(index),
      }));
  };

  function getChartColor(index: number): string {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
      'var(--chart-6)',
    ];
    return colors[index % colors.length];
  }

  const calculateChange = (data: number[]): number => {
    if (data.length < 14) return 0;
    const recent = data.slice(-7).reduce((a, b) => a + b, 0);
    const previous = data.slice(-14, -7).reduce((a, b) => a + b, 0);
    if (previous === 0) return 0;
    return Number((((recent - previous) / previous) * 100).toFixed(1));
  };

  const handleNewProject = () => router.push('/admin/projects/add');
  const handleNewSkill = () => router.push('/admin/skills/add');
  const handleNewEducation = () => router.push('/admin/education/form');
  const handleNewExperience = () => router.push('/admin/experience/add');

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="default" />
      </div>
    );
  }

  const techStackData = getTechStackData();
  const skillsDistribution = getSkillsDistribution();

  const visitTrend = stats.visitTrend;
  const visitSparkline = visitTrend.slice(-7).map((d) => d.visits);
  const uniqueVisitorSparkline = visitTrend.slice(-7).map((d) => d.uniqueVisitors);
  const pageViewSparkline = visitTrend.slice(-7).map((d) => d.pageViews);

  const visitsChange = calculateChange(visitTrend.map((d) => d.visits));
  const visitorsChange = calculateChange(visitTrend.map((d) => d.uniqueVisitors));
  const pageViewsChange = calculateChange(visitTrend.map((d) => d.pageViews));

  const topPages: TopPageData[] = stats.deepInsights.topPages.map((p) => ({
    page: p.path,
    views: p.views,
    averageTime: 0,
  }));

  const deviceTotal = stats.deepInsights.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
  const deviceBreakdown: DeviceData[] = stats.deepInsights.deviceBreakdown.map((d) => ({
    device: (d.device as DeviceData['device']) || 'desktop',
    count: d.count,
    percentage: deviceTotal > 0 ? Math.round((d.count / deviceTotal) * 100) : 0,
  }));

  const activityTypeMap: Record<string, Activity['type']> = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    PUBLISH: 'update',
    UNPUBLISH: 'update',
  };

  const recentActivities: Activity[] = stats.recentActivities.map((a) => ({
    id: a.id,
    type: activityTypeMap[a.action] || 'update',
    entity: (a.entity_type as Activity['entity']) || 'project',
    entityId: a.entity_id || '',
    entityName: a.entity_name || '',
    description: a.description,
    timestamp: a.created_at,
  }));

  return (
    <div className="relative">
      <div className="relative z-10 dashboard-container max-w-[1600px] mx-auto px-6 py-8">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="View your website and portfolio stats"
          breadcrumbs={[{ label: 'Dashboard' }]}
        />

        {/* Hero Section: Personal Overview */}
        <div className="mb-4">
          <PersonalOverviewCard />
        </div>

        {/* Section: Website Performance */}
        <div className="dashboard-section mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-2xl">Website Analytics</h2>
            <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide bg-[var(--bg-surface)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
              Real-time
            </div>
          </div>
          <div className="stats-grid">
            <StatCard
              icon={MousePointerClick}
              label="Total Visits"
              value={stats.growthAnalytics.totalVisits}
              change={visitsChange}
              changeLabel="increase"
              sparklineData={visitSparkline}
              color="var(--chart-1)"
            />
            <StatCard
              icon={Users}
              label="Unique Visitors"
              value={stats.growthAnalytics.uniqueVisitors}
              change={visitorsChange}
              changeLabel="increase"
              sparklineData={uniqueVisitorSparkline}
              color="#6366F1"
            />
            <StatCard
              icon={Eye}
              label="Page Views"
              value={stats.growthAnalytics.pageViews}
              change={pageViewsChange}
              changeLabel="increase"
              sparklineData={pageViewSparkline}
              color="#8B5CF6"
            />
            <StatCard
              icon={Download}
              label="CV Downloads"
              value={stats.growthAnalytics.cvDownloads}
              change={0}
              changeLabel="increase"
              sparklineData={[]}
              color="#EC4899"
            />
          </div>
        </div>

        {/* Section: Main Analytics Chart */}
        <div className="dashboard-section">
          <TrafficTrendChart data={visitTrend} />
        </div>

        {/* Section: Portfolio Stats */}
        <div className="dashboard-section">
          <h2 className="section-title">Portfolio Overview</h2>
          <div className="stats-grid">
            <StatCard
              icon={FolderOpen}
              label="Projects"
              value={projects?.length || 0}
              sparklineData={[]}
              color="var(--primary-500)"
            />
            <StatCard
              icon={Briefcase}
              label="Skills"
              value={skills?.length || 0}
              sparklineData={[]}
              color="var(--secondary-500)"
            />
            <StatCard
              icon={Award}
              label="Experience"
              value={experience?.length || 0}
              sparklineData={[]}
              color="var(--warning-500)"
            />
            <StatCard
              icon={GraduationCap}
              label="Education"
              value={education?.length || 0}
              sparklineData={[]}
              color="var(--success-500)"
            />
          </div>
        </div>

        {/* Section: Distribution */}
        <div className="dashboard-section">
          <h2 className="section-title">Distribution Breakdown</h2>
          <div className="charts-grid">
            <TechStackChart data={techStackData} />
            <SkillsDistributionChart data={skillsDistribution} />
          </div>
        </div>

        {/* Section: Traffic Sources & Device Distribution */}
        <div className="dashboard-section">
          <div className="charts-grid">
            <TrafficSourcesChart data={stats.deepInsights.trafficSources} />
            <DeviceBreakdownChart data={deviceBreakdown} />
          </div>
        </div>

        {/* Section: Activity & Actions */}
        <div className="bottom-grid-3">
          <TopPagesCard pages={topPages} />
          <RecentActivityList activities={recentActivities} maxItems={5} />
          <QuickActionsPanel
            onNewProject={handleNewProject}
            onNewSkill={handleNewSkill}
            onNewEducation={handleNewEducation}
            onNewExperience={handleNewExperience}
          />
        </div>
      </div>
    </div>
  );
}
