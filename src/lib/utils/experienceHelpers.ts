/**
 * Experience Management Utilities
 * Helper functions for date formatting, duration calculations, and experience sorting
 */

import type { ExperienceEntry, ExperienceRole } from '@/types/experience';

/**
 * Format date string (YYYY-MM) for display
 */
export function formatExperienceDate(dateString: string | null): string {
    if (!dateString) return 'Present';

    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return year; // Fallback to just year if month is invalid
    }

    return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Get date range display for a role
 */
export function getDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
    const start = formatExperienceDate(startDate);
    const end = isCurrent || !endDate ? 'Present' : formatExperienceDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Calculate duration between two dates in years and months
 */
export function calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate + '-01'); // Add day for valid date
    const end = endDate ? new Date(endDate + '-01') : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    return parts.length > 0 ? parts.join(' ') : '1 month';
}

/**
 * Calculate short duration (for mobile)
 */
export function calculateShortDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate + '-01');
    const end = endDate ? new Date(endDate + '-01') : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years}y`);
    }

    if (months > 0) {
        parts.push(`${months}mo`);
    }

    return parts.length > 0 ? parts.join(' ') : '1mo';
}

/**
 * Check if experience entry has any current role
 */
export function isCurrentExperience(entry: ExperienceEntry): boolean {
    return entry.roles?.some(role => role.isCurrent) || false;
}

/**
 * Get the most recent role from an experience entry
 */
export function getMostRecentRole(entry: ExperienceEntry): ExperienceRole | null {
    if (!entry.roles || entry.roles.length === 0) return null;

    // Sort roles by start date descending
    const sortedRoles = [...entry.roles].sort((a, b) => {
        return b.startDate.localeCompare(a.startDate);
    });

    return sortedRoles[0];
}

/**
 * Calculate overall period for an experience entry
 */
export function calculateOverallPeriod(entry: ExperienceEntry): string {
    if (!entry.roles || entry.roles.length === 0) return '';

    // Find earliest start date
    const startDates = entry.roles.map(r => r.startDate).sort();
    const earliestStart = startDates[0];

    // Find latest end date (or current if any role is current)
    const hasCurrentRole = entry.roles.some(r => r.isCurrent);
    if (hasCurrentRole) {
        return `${formatExperienceDate(earliestStart)} - Present`;
    }

    const endDates = entry.roles
        .map(r => r.endDate)
        .filter((d): d is string => d !== null)
        .sort();
    const latestEnd = endDates[endDates.length - 1] || earliestStart;

    return `${formatExperienceDate(earliestStart)} - ${formatExperienceDate(latestEnd)}`;
}

/**
 * Calculate total duration for an experience entry
 */
export function calculateTotalDuration(entry: ExperienceEntry): string {
    if (!entry.roles || entry.roles.length === 0) return '';

    // Find earliest start date
    const startDates = entry.roles.map(r => r.startDate).sort();
    const earliestStart = startDates[0];

    // Find latest end date
    const hasCurrentRole = entry.roles.some(r => r.isCurrent);
    const latestEnd = hasCurrentRole ? null :
        entry.roles
            .map(r => r.endDate)
            .filter((d): d is string => d !== null)
            .sort()
            .pop() || null;

    return calculateDuration(earliestStart, latestEnd);
}

/**
 * Sort experiences by most recent first
 */
export function sortExperiences(experiences: ExperienceEntry[]): ExperienceEntry[] {
    return [...experiences].sort((a, b) => {
        const aHasCurrent = isCurrentExperience(a);
        const bHasCurrent = isCurrentExperience(b);

        // Current experiences first
        if (aHasCurrent && !bHasCurrent) return -1;
        if (!aHasCurrent && bHasCurrent) return 1;

        // Then by most recent start date
        const aMostRecent = getMostRecentRole(a);
        const bMostRecent = getMostRecentRole(b);

        if (!aMostRecent) return 1;
        if (!bMostRecent) return -1;

        return bMostRecent.startDate.localeCompare(aMostRecent.startDate);
    });
}

/**
 * Sort roles within an experience (most recent first)
 */
export function sortRoles(roles: ExperienceRole[]): ExperienceRole[] {
    return [...roles].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/**
 * Calculate total years of experience across all entries
 */
export function calculateTotalExperience(experiences: ExperienceEntry[]): string {
    if (!experiences || experiences.length === 0) return '0 years';

    // Collect all date ranges
    const dateRanges: Array<{ start: Date; end: Date }> = [];

    experiences.forEach(entry => {
        entry.roles?.forEach(role => {
            const start = new Date(role.startDate + '-01');
            const end = role.endDate ? new Date(role.endDate + '-01') : new Date();
            dateRanges.push({ start, end });
        });
    });

    if (dateRanges.length === 0) return '0 years';

    // Sort by start date
    dateRanges.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Merge overlapping ranges
    const merged: Array<{ start: Date; end: Date }> = [dateRanges[0]];

    for (let i = 1; i < dateRanges.length; i++) {
        const current = dateRanges[i];
        const last = merged[merged.length - 1];

        if (current.start <= last.end) {
            // Overlapping, extend the end if needed
            if (current.end > last.end) {
                last.end = current.end;
            }
        } else {
            // No overlap, add new range
            merged.push(current);
        }
    }

    // Calculate total months
    let totalMonths = 0;
    merged.forEach(range => {
        const years = range.end.getFullYear() - range.start.getFullYear();
        const months = range.end.getMonth() - range.start.getMonth();
        totalMonths += years * 12 + months;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

    return parts.join(' ') || '1 month';
}
