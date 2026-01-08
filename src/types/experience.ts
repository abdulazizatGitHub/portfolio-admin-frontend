export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'freelance'
  | 'other';

export interface ExperienceRole {
  id: string; // Stable ID for React lists
  jobTitle: string; // Required
  startDate: string; // YYYY-MM format, required
  endDate: string | null; // YYYY-MM format or null for current role
  isCurrent: boolean; // Derived from endDate === null
  description: string; // Rich-text / bullet-friendly
  orderIndex: number; // For ordering
}

export interface ExperienceEntry {
  id?: number;
  organization: string; // Required
  location?: string; // Optional
  employmentType?: EmploymentType; // Optional
  summary?: string; // Organization-level summary
  roles: ExperienceRole[]; // 1..n roles
  overallPeriod: string; // Auto-calculated from first role start to last role end
  orderIndex: number; // Order across all experiences
}

