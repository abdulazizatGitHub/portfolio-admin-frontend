/**
 * Contact Management Utilities
 * Helper functions for contact info icons, validation, and social platforms
 */

import {
    Mail,
    Phone,
    MapPin,
    Github,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    type LucideIcon
} from 'lucide-react';

// Contact type
export type ContactType = 'email' | 'phone' | 'location';

// Contact icon mapping
const contactIcons: Record<ContactType, LucideIcon> = {
    email: Mail,
    phone: Phone,
    location: MapPin,
};

// Contact color mapping
const contactColors: Record<ContactType, string> = {
    email: '#3B82F6', // Blue
    phone: '#10B981', // Green
    location: '#8B5CF6', // Purple
};

/**
 * Get icon component for contact type
 */
export function getContactIcon(type: ContactType): LucideIcon {
    return contactIcons[type];
}

/**
 * Get color for contact type
 */
export function getContactColor(type: ContactType): string {
    return contactColors[type];
}

/**
 * Social platform configuration
 */
export interface SocialPlatform {
    name: string;
    icon: LucideIcon;
    color: string;
    placeholder: string;
    urlPattern?: RegExp;
}

/**
 * Common social platforms with icons and colors
 */
export const commonSocialPlatforms: SocialPlatform[] = [
    {
        name: 'GitHub',
        icon: Github,
        color: '#181717',
        placeholder: 'https://github.com/username',
        urlPattern: /github\.com/i,
    },
    {
        name: 'LinkedIn',
        icon: Linkedin,
        color: '#0A66C2',
        placeholder: 'https://linkedin.com/in/username',
        urlPattern: /linkedin\.com/i,
    },
    {
        name: 'Twitter',
        icon: Twitter,
        color: '#1DA1F2',
        placeholder: 'https://twitter.com/username',
        urlPattern: /twitter\.com|x\.com/i,
    },
    {
        name: 'Facebook',
        icon: Facebook,
        color: '#1877F2',
        placeholder: 'https://facebook.com/username',
        urlPattern: /facebook\.com/i,
    },
    {
        name: 'Instagram',
        icon: Instagram,
        color: '#E4405F',
        placeholder: 'https://instagram.com/username',
        urlPattern: /instagram\.com/i,
    },
    {
        name: 'YouTube',
        icon: Youtube,
        color: '#FF0000',
        placeholder: 'https://youtube.com/@username',
        urlPattern: /youtube\.com|youtu\.be/i,
    },
];

/**
 * Get platform info by name
 */
export function getPlatformInfo(platformName: string): SocialPlatform | null {
    return commonSocialPlatforms.find(
        p => p.name.toLowerCase() === platformName.toLowerCase()
    ) || null;
}

/**
 * Detect platform from URL
 */
export function detectPlatformFromUrl(url: string): string | null {
    for (const platform of commonSocialPlatforms) {
        if (platform.urlPattern && platform.urlPattern.test(url)) {
            return platform.name;
        }
    }
    return null;
}

/**
 * Get icon for social platform (fallback to generic icon)
 */
export function getSocialIcon(platformName: string): LucideIcon {
    const platform = getPlatformInfo(platformName);
    return platform?.icon || Github; // Fallback to GitHub icon
}

/**
 * Get color for social platform
 */
export function getPlatformColor(platformName: string): string {
    const platform = getPlatformInfo(platformName);
    return platform?.color || '#6B7280'; // Fallback to gray
}

/**
 * Format URL for display (truncate long URLs)
 */
export function formatUrlDisplay(url: string, maxLength: number = 40): string {
    if (url.length <= maxLength) return url;

    // Remove protocol for display
    let displayUrl = url.replace(/^https?:\/\//, '');

    if (displayUrl.length <= maxLength) return displayUrl;

    // Truncate middle
    const start = displayUrl.substring(0, maxLength / 2 - 2);
    const end = displayUrl.substring(displayUrl.length - maxLength / 2 + 2);
    return `${start}...${end}`;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): string | null {
    if (!email || email.trim().length === 0) {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return null; // Valid
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): string | null {
    if (!phone || phone.trim().length === 0) {
        return 'Phone number is required';
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        return 'Please enter a valid phone number';
    }

    if (phone.replace(/\D/g, '').length < 10) {
        return 'Phone number must be at least 10 digits';
    }

    return null; // Valid
}

/**
 * Validate URL
 */
export function validateUrl(url: string): string | null {
    if (!url || url.trim().length === 0) {
        return 'URL is required';
    }

    try {
        new URL(url);
        return null; // Valid
    } catch {
        return 'Please enter a valid URL (e.g., https://example.com)';
    }
}

/**
 * Validate social URL for specific platform
 */
export function validateSocialUrl(url: string, platformName?: string): string | null {
    const urlError = validateUrl(url);
    if (urlError) return urlError;

    // If platform specified, check if URL matches platform
    if (platformName) {
        const platform = getPlatformInfo(platformName);
        if (platform?.urlPattern && !platform.urlPattern.test(url)) {
            return `URL doesn't match ${platformName} format`;
        }
    }

    return null; // Valid
}

/**
 * Generate href for contact info (mailto:, tel:)
 */
export function generateContactHref(type: ContactType, value: string): string {
    switch (type) {
        case 'email':
            return `mailto:${value}`;
        case 'phone':
            // Remove non-numeric characters for tel: link
            const cleanPhone = value.replace(/\D/g, '');
            return `tel:+${cleanPhone}`;
        case 'location':
            // Google Maps search
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
        default:
            return '#';
    }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}
