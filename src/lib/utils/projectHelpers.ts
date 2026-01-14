/**
 * Project Management Utilities
 * Helper functions for project status, validation, and data processing
 */

import type { Project } from '@/types/projects';

// Project status type
export type ProjectStatus = 'live' | 'draft' | 'development' | 'archived';

// Status configuration
export interface ProjectStatusInfo {
    status: ProjectStatus;
    label: string;
    color: string;
    bgColor: string;
    description: string;
}

/**
 * Status color and label mappings
 */
export const projectStatusConfig: Record<ProjectStatus, ProjectStatusInfo> = {
    live: {
        status: 'live',
        label: 'Live',
        color: '#10B981', // Green
        bgColor: '#10B98120',
        description: 'Published and accessible to public',
    },
    draft: {
        status: 'draft',
        label: 'Draft',
        color: '#6B7280', // Gray
        bgColor: '#6B728020',
        description: 'Work in progress, not published',
    },
    development: {
        status: 'development',
        label: 'Development',
        color: '#F59E0B', // Orange
        bgColor: '#F59E0B20',
        description: 'Currently being built',
    },
    archived: {
        status: 'archived',
        label: 'Archived',
        color: '#EF4444', // Red
        bgColor: '#EF444420',
        description: 'Archived and no longer active',
    },
};

/**
 * Get status information by status value
 */
export function getStatusInfo(status: ProjectStatus): ProjectStatusInfo {
    return projectStatusConfig[status];
}

/**
 * Common tech stack suggestions
 */
export const commonTechStack = [
    // Frontend
    'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Sass',

    // Backend
    'Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring Boot', 'Go', 'PHP', 'Laravel', 'Ruby on Rails',

    // Database
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',

    // DevOps & Cloud
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Vercel', 'Netlify',

    // Tools
    'Git', 'GitHub Actions', 'CI/CD', 'Jest', 'Cypress',
];

/**
 * Get tech stack suggestions based on query
 */
export function getTechSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    return commonTechStack
        .filter(tech => tech.toLowerCase().includes(lowerQuery))
        .slice(0, limit);
}

/**
 * Validate project title
 */
export function validateProjectTitle(title: string): string | null {
    if (!title || title.trim().length === 0) {
        return 'Project title is required';
    }

    if (title.length > 100) {
        return 'Title must be 100 characters or less';
    }

    return null; // Valid
}

/**
 * Validate short description
 */
export function validateShortDescription(description: string): string | null {
    if (!description || description.trim().length === 0) {
        return 'Short description is required';
    }

    if (description.length > 200) {
        return 'Short description must be 200 characters or less';
    }

    return null; // Valid
}

/**
 * Validate URL
 */
export function validateUrl(url: string): string | null {
    if (!url) return null; // Optional field

    try {
        new URL(url);
        return null; // Valid
    } catch {
        return 'Please enter a valid URL (e.g., https://example.com)';
    }
}

/**
 * Format date for display
 */
export function formatProjectDate(dateString: string | null): string {
    if (!dateString) return 'Ongoing';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Get project duration string
 */
export function getProjectDuration(startDate: string, endDate: string | null): string {
    const start = formatProjectDate(startDate);
    const end = formatProjectDate(endDate);

    if (endDate) {
        return `${start} - ${end}`;
    }

    return `${start} - Present`;
}

/**
 * Check if project is completed
 */
export function isProjectCompleted(project: Project): boolean {
    return project.endDate !== null && project.endDate !== undefined;
}

/**
 * Get project age in days
 */
export function getProjectAge(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Sort projects by different criteria
 */
export type ProjectSortBy = 'recent' | 'title' | 'status' | 'featured';

export function sortProjects(
    projects: Project[],
    sortBy: ProjectSortBy
): Project[] {
    const sorted = [...projects];

    switch (sortBy) {
        case 'recent':
            return sorted.sort((a, b) => {
                const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return dateB - dateA;
            });

        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));

        case 'status':
            return sorted.sort((a, b) => a.status.localeCompare(b.status));

        case 'featured':
            return sorted.sort((a, b) => {
                if (a.featured === b.featured) return 0;
                return a.featured ? -1 : 1;
            });

        default:
            return sorted;
    }
}

/**
 * Generate placeholder thumbnail URL
 */
export function getPlaceholderThumbnail(projectTitle: string): string {
    const colors = ['3B82F6', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'];
    const hash = projectTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colors.length;
    const color = colors[colorIndex];

    return `https://via.placeholder.com/800x450/${color}/FFFFFF?text=${encodeURIComponent(projectTitle)}`;
}
