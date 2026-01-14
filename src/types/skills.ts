export interface Skill {
  id?: number;
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'soft' | 'technical' | 'ai';
  orderIndex: number;
  // Enhanced fields for better skill representation
  context?: string; // Optional usage context (how skill was used)
  relatedTools?: string[]; // Related tools in the ecosystem
}

// Type aliases for improved type safety
export type SkillCategory = Skill['category'];

// Form-specific data type (without auto-generated fields)
export interface SkillFormData {
  name: string;
  category: SkillCategory;
  level: number;
  context?: string;
}

