/**
 * About Section Utilities
 * Helper functions for role icons, colors, and formatting
 */

import {
    Code,
    Palette,
    Users,
    Lightbulb,
    Rocket,
    Brain,
    Target,
    Briefcase,
    type LucideIcon
} from 'lucide-react';
import type { AboutSection } from '@/types/about';

/**
 * Get icon for role title based on keywords
 */
export function getRoleIcon(roleTitle: string): LucideIcon {
    const title = roleTitle.toLowerCase();

    if (title.includes('developer') || title.includes('engineer') || title.includes('coder')) {
        return Code;
    }
    if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
        return Palette;
    }
    if (title.includes('lead') || title.includes('manager') || title.includes('team')) {
        return Users;
    }
    if (title.includes('enthusiast') || title.includes('learner')) {
        return Lightbulb;
    }
    if (title.includes('problem') || title.includes('solver')) {
        return Brain;
    }
    if (title.includes('founder') || title.includes('entrepreneur')) {
        return Rocket;
    }
    if (title.includes('goal') || title.includes('driven')) {
        return Target;
    }

    return Briefcase; // Default
}

/**
 * Get color for role based on title keywords
 */
export function getRoleColor(roleTitle: string): string {
    const title = roleTitle.toLowerCase();

    if (title.includes('developer') || title.includes('engineer')) {
        return '#3B82F6'; // Blue
    }
    if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
        return '#EC4899'; // Pink
    }
    if (title.includes('lead') || title.includes('manager') || title.includes('team')) {
        return '#8B5CF6'; // Purple
    }
    if (title.includes('enthusiast')) {
        return '#10B981'; // Green
    }
    if (title.includes('problem') || title.includes('solver')) {
        return '#F59E0B'; // Amber
    }

    return '#6366F1'; // Indigo default
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Sort about sections by orderIndex
 */
export function sortAboutSections(sections: AboutSection[]): AboutSection[] {
    return [...sections].sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Validate role title
 */
export function validateRoleTitle(title: string): string | null {
    if (!title || title.trim().length === 0) {
        return 'Role title is required';
    }
    if (title.length > 50) {
        return 'Role title must be 50 characters or less';
    }
    return null; // Valid
}

/**
 * Validate paragraph
 */
export function validateParagraph(text: string): string | null {
    if (!text || text.trim().length === 0) {
        return 'Paragraph cannot be empty';
    }
    if (text.length > 500) {
        return 'Paragraph must be 500 characters or less';
    }
    return null; // Valid
}

/**
 * Validate stat
 */
export function validateStat(label: string, value: string): string | null {
    if (!label || label.trim().length === 0) {
        return 'Stat label is required';
    }
    if (!value || value.trim().length === 0) {
        return 'Stat value is required';
    }
    if (label.length > 30) {
        return 'Label must be 30 characters or less';
    }
    if (value.length > 30) {
        return 'Value must be 30 characters or less';
    }
    return null; // Valid
}

/**
 * Format date for display
 */
export function formatAboutDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Get gradient for stat card
 */
export function getStatGradient(index: number): string {
    const gradients = [
        'from-blue-500 to-purple-500',
        'from-green-500 to-teal-500',
        'from-orange-500 to-red-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-blue-500',
        'from-amber-500 to-orange-500',
    ];
    return gradients[index % gradients.length];
}
