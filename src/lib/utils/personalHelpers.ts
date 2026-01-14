/**
 * Personal Section Utilities
 * Helper functions for roles, CV files, and status indicators
 */

import { User, FileText, Briefcase, Star, Download, UploadCloud } from 'lucide-react';
import type { PersonalProfile } from '@/types/personal';

/**
 * Get color for role badges
 */
export function getRoleBadgeColor(index: number): string {
    const colors = [
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#10B981', // Green
        '#F59E0B', // Amber
        '#6366F1', // Indigo
    ];
    return colors[index % colors.length];
}

/**
 * Format file size for display
 */
export function formatCVSize(base64String: string | undefined): string {
    if (!base64String) return 'No file';

    // Estimate size from base64 (approx 3/4 of string length)
    const lengthInBytes = (base64String.length * 3) / 4;

    if (lengthInBytes < 1024) return `${lengthInBytes.toFixed(0)} B`;
    if (lengthInBytes < 1024 * 1024) return `${(lengthInBytes / 1024).toFixed(1)} KB`;
    return `${(lengthInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Extract file extension from name
 */
export function getFileExtension(filename: string | undefined): string {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1].toUpperCase()}` : '';
}

/**
 * Sort profiles (default first)
 */
export function sortProfiles(profiles: PersonalProfile[]): PersonalProfile[] {
    return [...profiles].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
    });
}

/**
 * Validate profile data
 */
export function validateProfile(profile: Partial<PersonalProfile>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!profile.name?.trim()) errors.name = 'Name is required';
    if (!profile.titlePrefix?.trim()) errors.titlePrefix = 'Title line is required';
    if (!profile.description?.trim()) errors.description = 'Bio description is required';
    if (!profile.roles || profile.roles.length === 0) errors.roles = 'At least one role is required';

    return errors;
}
