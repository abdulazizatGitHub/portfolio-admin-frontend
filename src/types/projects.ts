// A single "why this approach" entry in a project's Decision Log, shown on
// the public "Proof of Work" site.
export interface DecisionEntry {
  question: string;
  answer: string;
}

export interface Project {
  id?: string;
  title: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  status: 'live' | 'draft' | 'development' | 'archived';
  featured: boolean;
  startDate: string;
  endDate: string | null;
  orderIndex: number;
  isPublished: boolean;
  decisions?: DecisionEntry[] | null;
  createdAt?: string;
  updatedAt?: string;
}

// Type aliases for improved type safety
export type ProjectStatus = Project['status'];

// Form-specific data type (without auto-generated fields)
export interface ProjectFormData {
  title: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  isPublished: boolean;
  decisions: DecisionEntry[];
}
