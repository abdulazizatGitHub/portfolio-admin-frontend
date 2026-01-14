/**
 * Education Management Utilities
 * Helper functions for date formatting, GPA display, and education sorting
 */

import { GraduationCap, Award, BookOpen, type LucideIcon } from 'lucide-react';
import type { EducationEntry } from '@/types/education';

/**
 * Get icon for education entry
 */
export function getEducationIcon(degreeType?: string): LucideIcon {
    if (!degreeType) return GraduationCap;

    const type = degreeType.toLowerCase();
    if (type.includes('phd') || type.includes('doctorate')) return Award;
    if (type.includes('certificate') || type.includes('bootcamp')) return BookOpen;
    return GraduationCap;
}

/**
 * Get color for degree type
 */
export function getDegreeColor(degreeType?: string): string {
    if (!degreeType) return '#8B5CF6'; // Purple default

    const type = degreeType.toLowerCase();
    if (type.includes('phd') || type.includes('doctorate')) return '#F59E0B'; // Gold
    if (type.includes('master')) return '#8B5CF6'; // Purple
    if (type.includes('bachelor')) return '#3B82F6'; // Blue
    if (type.includes('certificate') || type.includes('bootcamp')) return '#10B981'; // Green
    return '#8B5CF6'; // Purple default
}

/**
 * Format date string (YYYY-MM) for display
 */
export function formatEducationDate(dateString: string | null): string {
    if (!dateString) return 'Present';

    // Handle YYYY-MM format
    if (dateString.includes('-')) {
        const [year, month] = dateString.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = parseInt(month, 10) - 1;

        if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
            return year;
        }

        return `${monthNames[monthIndex]} ${year}`;
    }

    // Handle year-only format
    return dateString;
}

/**
 * Get date range display
 */
export function getEducationDateRange(startDate: string, endDate: string | null, current?: boolean): string {
    const start = formatEducationDate(startDate);
    const end = current || !endDate ? 'Present' : formatEducationDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Calculate duration for education
 */
export function calculateEducationDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate.includes('-') ? startDate + '-01' : startDate + '-01-01');
    const end = endDate ? new Date(endDate.includes('-') ? endDate + '-01' : endDate + '-01-01') : new Date();

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

    if (months > 0 && years < 5) { // Only show months if less than 5 years
        parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    return parts.length > 0 ? parts.join(' ') : '1 month';
}

/**
 * Check if currently enrolled
 */
export function isCurrentEducation(entry: EducationEntry): boolean {
    // Check if there's a current field
    if ('current' in entry && typeof entry.current === 'boolean') {
        return entry.current;
    }

    // Check if period includes "Present"
    return entry.period?.toLowerCase().includes('present') || false;
}

/**
 * Sort education entries (most recent first, current first)
 */
export function sortEducation(entries: EducationEntry[]): EducationEntry[] {
    return [...entries].sort((a, b) => {
        const aIsCurrent = isCurrentEducation(a);
        const bIsCurrent = isCurrentEducation(b);

        // Current education first
        if (aIsCurrent && !bIsCurrent) return -1;
        if (!aIsCurrent && bIsCurrent) return 1;

        // Then by orderIndex if available
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
            return a.orderIndex - b.orderIndex;
        }

        // Fallback to period string comparison
        return b.period.localeCompare(a.period);
    });
}

/**
 * Format GPA display
 */
export function formatGPA(grade: string | number | null | undefined, scale?: number): string | null {
    if (!grade) return null;

    if (typeof grade === 'number') {
        const scaleStr = scale ? `/${scale}` : '/4.0';
        return `${grade.toFixed(1)}${scaleStr}`;
    }

    // If already formatted (e.g., "3.9/4.0") return as-is
    if (typeof grade === 'string' && grade.includes('/')) {
        return grade;
    }

    // If numeric string
    const numGrade = parseFloat(grade);
    if (!isNaN(numGrade)) {
        const scaleStr = scale ? `/${scale}` : '/4.0';
        return `${numGrade.toFixed(1)}${scaleStr}`;
    }

    // Return as-is for text grades (e.g., "First Class Honours")
    return grade;
}

/**
 * Parse achievements from text (comma or newline separated)
 */
export function parseAchievements(text: string | null | undefined): string[] {
    if (!text) return [];

    // Split by newlines or bullet points
    const lines = text.split(/\n|•/).map(line => line.trim()).filter(Boolean);

    // If no newlines, try comma separation
    if (lines.length === 1) {
        const commaSplit = text.split(',').map(item => item.trim()).filter(Boolean);
        if (commaSplit.length > 1) {
            return commaSplit;
        }
    }

    return lines;
}

/**
 * Extract institution name from title (if combined)
 */
export function parseEducationTitle(title: string): { degree?: string; institution?: string } {
    // If title contains " - " or " at ", try to split
    if (title.includes(' - ')) {
        const [degree, institution] = title.split(' - ').map(s => s.trim());
        return { degree, institution };
    }

    if (title.includes(' at ')) {
        const [degree, institution] = title.split(' at ').map(s => s.trim());
        return { degree, institution };
    }

    // Return title as degree by default
    return { degree: title };
}
