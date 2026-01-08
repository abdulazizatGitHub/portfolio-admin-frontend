'use client';

import './3d-charts.css';
import { useEducation, useExperience, useProjects, useSkills } from '@/lib/hooks';
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
  Download
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
import { mockActivities, mockSparklineData, mockWebsiteAnalytics } from '@/lib/data/mockData';
import { useRouter } from 'next/navigation';
import type { Activity } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: experience, isLoading: experienceLoading } = useExperience();

  const isLoading = projectsLoading || skillsLoading || educationLoading || experienceLoading;

  // Website Analytics Data
  const analytics = mockWebsiteAnalytics;

  // Generate sparkline for website visits (last 7 days from visitTrend)
  const visitSparkline = analytics.visitTrend.slice(-7).map(d => d.visits);
  const uniqueVisitorSparkline = analytics.visitTrend.slice(-7).map(d => d.uniqueVisitors);
  const pageViewSparkline = analytics.visitTrend.slice(-7).map(d => d.pageViews);
  const cvDownloadSparkline = [32, 35, 38, 41, 43, 45, 47]; // Mock CV download trend

  // Calculate tech stack distribution
  const getTechStackData = () => {
    if (!projects) return [];
    
    const techCount: Record<string, number> = {};
    projects.forEach(project => {
      project.techStack.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });
    
    return Object.entries(techCount).map(([name, count], index) => ({
      name,
      count,
      color: getChartColor(index)
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
      soft: 0
    };
    
    skills.forEach(skill => {
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
        percentage: Math.round((count / total) * 100),
        color: getChartColor(index)
      }));
  };

  // Get chart colors
  function getChartColor(index: number): string {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
      'var(--chart-6)'
    ];
    return colors[index % colors.length];
  }

  // Calculate analytics changes (comparing last 7 days vs previous 7 days)
  const calculateChange = (data: number[]): number => {
    if (data.length < 14) return 0;
    const recent = data.slice(-7).reduce((a, b) => a + b, 0);
    const previous = data.slice(-14, -7).reduce((a, b) => a + b, 0);
    if (previous === 0) return 0;
    return Number((((recent - previous) / previous) * 100).toFixed(1));
  };

  const visitsChange = calculateChange(analytics.visitTrend.map(d => d.visits));
  const visitorsChange = calculateChange(analytics.visitTrend.map(d => d.uniqueVisitors));
  const pageViewsChange = calculateChange(analytics.visitTrend.map(d => d.pageViews));

  // Navigation handlers for quick actions
  const handleNewProject = () => router.push('/admin/projects/add');
  const handleNewSkill = () => router.push('/admin/skills/add');
  const handleNewEducation = () => router.push('/admin/education/add');
  const handleNewExperience = () => router.push('/admin/experience/add');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="default" />
      </div>
    );
  }

  const techStackData = getTechStackData();
  const skillsDistribution = getSkillsDistribution();

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content and website analytics"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Section: Portfolio Stats */}
      <div className="dashboard-section">
        <h2 className="section-title">Portfolio Content</h2>
        <div className="stats-grid">
          <StatCard
            icon={FolderOpen}
            label="Total Projects"
            value={projects?.length || 0}
            change={12.5}
            sparklineData={mockSparklineData.projects}
            color="var(--primary-500)"
          />
          <StatCard
            icon={Briefcase}
            label="Total Skills"
            value={skills?.length || 0}
            change={8.3}
            sparklineData={mockSparklineData.skills}
            color="var(--secondary-500)"
          />
          <StatCard
            icon={GraduationCap}
            label="Education Entries"
            value={education?.length || 0}
            sparklineData={mockSparklineData.education}
            color="var(--success-500)"
          />
          <StatCard
            icon={Award}
            label="Experience Entries"
            value={experience?.length || 0}
            sparklineData={mockSparklineData.experience}
            color="var(--warning-500)"
          />
        </div>
      </div>

      {/* Section: Website Analytics */}
      <div className="dashboard-section">
        <h2 className="section-title">Website Analytics</h2>
        <div className="stats-grid">
          <StatCard
            icon={MousePointerClick}
            label="Total Visits"
            value={analytics.totalVisits}
            change={visitsChange}
            changeLabel="vs last week"
            sparklineData={visitSparkline}
            color="var(--chart-2)"
          />
          <StatCard
            icon={Users}
            label="Unique Visitors"
            value={analytics.uniqueVisitors}
            change={visitorsChange}
            changeLabel="vs last week"
            sparklineData={uniqueVisitorSparkline}
            color="var(--chart-3)"
          />
          <StatCard
            icon={Eye}
            label="Page Views"
            value={analytics.pageViews}
            change={pageViewsChange}
            changeLabel="vs last week"
            sparklineData={pageViewSparkline}
            color="var(--chart-4)"
          />
          <StatCard
            icon={Download}
            label="CV Downloads"
            value={analytics.cvDownloads}
            change={15.2}
            changeLabel="vs last week"
            sparklineData={cvDownloadSparkline}
            color="var(--chart-5)"
          />
        </div>
      </div>

      {/* Section: Traffic Trend */}
      <div className="dashboard-section">
        <TrafficTrendChart data={analytics.visitTrend} />
      </div>

      {/* Section: Portfolio Charts */}
      <div className="dashboard-section">
        <h2 className="section-title">Portfolio Insights</h2>
        <div className="charts-grid">
          <TechStackChart data={techStackData} />
          <SkillsDistributionChart data={skillsDistribution} />
        </div>
      </div>

      {/* Section: Analytics Insights */}
      <div className="dashboard-section">
        <h2 className="section-title">Visitor Insights</h2>
        <div className="charts-grid">
          <DeviceBreakdownChart data={analytics.deviceBreakdown} />
          <TrafficSourcesChart data={analytics.trafficSources} />
        </div>
      </div>

      {/* Section: Details */}
      <div className="bottom-grid-3">
        <TopPagesCard pages={analytics.topPages} />
        <RecentActivityList
          activities={mockActivities as Activity[]}
          maxItems={5}
        />
        <QuickActionsPanel
          onNewProject={handleNewProject}
          onNewSkill={handleNewSkill}
          onNewEducation={handleNewEducation}
          onNewExperience={handleNewExperience}
        />
      </div>
    </div>
  );
}
