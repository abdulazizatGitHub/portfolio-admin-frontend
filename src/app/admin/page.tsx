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
import { motion } from 'framer-motion';
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

  // Generate sparkline for website visits
  const visitSparkline = analytics.visitTrend.slice(-7).map(d => d.visits);
  const uniqueVisitorSparkline = analytics.visitTrend.slice(-7).map(d => d.uniqueVisitors);
  const pageViewSparkline = analytics.visitTrend.slice(-7).map(d => d.pageViews);
  const cvDownloadSparkline = [32, 35, 38, 41, 43, 45, 47];

  // Calculate tech stack distribution
  const getTechStackData = () => {
    if (!projects) return [];

    const techCount: Record<string, number> = {};
    projects.forEach(project => {
      project.techStack?.forEach(tech => {
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
      soft: 0,
      technical: 0,
      ai: 0
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
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: getChartColor(index)
      }));
  };

  function getChartColor(index: number): string {
    const colors = [
      'var(--chart-1)',
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#F59E0B', // Amber
      '#10B981', // Emerald
    ];
    return colors[index % colors.length];
  }

  const calculateChange = (data: number[]): number => {
    if (data.length < 14) return 0;
    const recent = data.slice(-7).reduce((a, b) => a + b, 0);
    const previous = data.slice(-14, -7).reduce((a, b) => a + b, 0);
    if (previous === 0) return 3.2; // Default positive trend for mock
    return Number((((recent - previous) / previous) * 100).toFixed(1));
  };

  const visitsChange = calculateChange(analytics.visitTrend.map(d => d.visits));
  const visitorsChange = calculateChange(analytics.visitTrend.map(d => d.uniqueVisitors));
  const pageViewsChange = calculateChange(analytics.visitTrend.map(d => d.pageViews));

  const handleNewProject = () => router.push('/admin/projects?add=true');
  const handleNewSkill = () => router.push('/admin/skills?add=true');
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 dashboard-container max-w-[1600px] mx-auto px-6 py-8"
      >
        {/* Page Header */}
        <PageHeader
          title="Command Center"
          description="Your portfolio performance at a glance"
          breadcrumbs={[{ label: 'Dashboard' }]}
        />

        {/* Hero Section: Personal Identity */}
        <motion.div variants={sectionVariants} className="mb-4">
          <PersonalOverviewCard />
        </motion.div>

        {/* Section: Website Performance */}
        <motion.div variants={sectionVariants} className="dashboard-section mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-2xl">Growth Analytics</h2>
            <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest bg-[var(--bg-surface)] px-3 py-1 rounded-full border border-[var(--border-subtle)] shadow-sm">
              Realtime Data
            </div>
          </div>
          <div className="stats-grid">
            <StatCard
              icon={MousePointerClick}
              label="Total Engagement"
              value={analytics.totalVisits}
              change={visitsChange}
              changeLabel="increase"
              sparklineData={visitSparkline}
              color="var(--chart-1)"
              delay={0.1}
            />
            <StatCard
              icon={Users}
              label="Active Network"
              value={analytics.uniqueVisitors}
              change={visitorsChange}
              changeLabel="growth"
              sparklineData={uniqueVisitorSparkline}
              color="#6366F1"
              delay={0.2}
            />
            <StatCard
              icon={Eye}
              label="Presence Index"
              value={analytics.pageViews}
              change={pageViewsChange}
              changeLabel="visibility"
              sparklineData={pageViewSparkline}
              color="#8B5CF6"
              delay={0.3}
            />
            <StatCard
              icon={Download}
              label="Interest Level"
              value={analytics.cvDownloads}
              change={15.2}
              changeLabel="interest"
              sparklineData={cvDownloadSparkline}
              color="#EC4899"
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Section: Main Analytics Chart */}
        <motion.div variants={sectionVariants} className="dashboard-section">
          <TrafficTrendChart data={analytics.visitTrend} />
        </motion.div>

        {/* Section: Portfolio Stats (Second Row Mini Stats) */}
        <motion.div variants={sectionVariants} className="dashboard-section">
          <h2 className="section-title">Content Velocity</h2>
          <div className="stats-grid">
            <StatCard
              icon={FolderOpen}
              label="Innovations"
              value={projects?.length || 0}
              change={12.5}
              sparklineData={mockSparklineData.projects}
              color="var(--primary-500)"
              delay={0.5}
            />
            <StatCard
              icon={Briefcase}
              label="Capabilities"
              value={skills?.length || 0}
              change={8.3}
              sparklineData={mockSparklineData.skills}
              color="var(--secondary-500)"
              delay={0.6}
            />
            <StatCard
              icon={Award}
              label="Professional Milestones"
              value={experience?.length || 0}
              sparklineData={mockSparklineData.experience}
              color="var(--warning-500)"
              delay={0.7}
            />
            <StatCard
              icon={GraduationCap}
              label="Academic Assets"
              value={education?.length || 0}
              sparklineData={mockSparklineData.education}
              color="var(--success-500)"
              delay={0.8}
            />
          </div>
        </motion.div>

        {/* Section: Qualitative Insights */}
        <motion.div variants={sectionVariants} className="dashboard-section">
          <h2 className="section-title">Deep Insights</h2>
          <div className="charts-grid">
            <TechStackChart data={techStackData} />
            <SkillsDistributionChart data={skillsDistribution} />
          </div>
        </motion.div>

        {/* Section: Traffic Sources & Device Distribution */}
        <motion.div variants={sectionVariants} className="dashboard-section">
          <div className="charts-grid">
            <TrafficSourcesChart data={analytics.trafficSources} />
            <DeviceBreakdownChart data={analytics.deviceBreakdown} />
          </div>
        </motion.div>

        {/* Section: Activity & Actions */}
        <motion.div variants={sectionVariants} className="bottom-grid-3">
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
        </motion.div>
      </motion.div>
    </div>
  );
}

