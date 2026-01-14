/**
 * Skill Management Utilities
 * Helper functions for skill normalization, validation, and confidence calculation
 */

// Common skills library for auto-suggestions
export const commonSkills = [
  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'TypeScript', 'JavaScript',
  'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Redux', 'Svelte', 'Webpack', 'Vite',
  
  // Backend
  'Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#', '.NET',
  'Express.js', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Laravel',
  
  // Database
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
  'SQLite', 'Cassandra', 'Neo4j', 'Prisma', 'TypeORM',
  
  // DevOps
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'GitHub Actions',
  'Jenkins', 'Terraform', 'Ansible', 'Nginx', 'Linux',
  
  // Tools
  'Git', 'VS Code', 'Figma', 'Postman', 'Jira', 'Notion', 'Slack',
  
  // Soft Skills
  'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration',
  'Project Management', 'Mentoring', 'Technical Writing',
];

// Skill name capitalization rules
const skillCapitalizationRules: Record<string, string> = {
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'vuejs': 'Vue.js',
  'vue': 'Vue.js',
  'nextjs': 'Next.js',
  'next': 'Next.js',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'html': 'HTML',
  'css': 'CSS',
  'sass': 'Sass',
  'scss': 'SCSS',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'aws': 'AWS',
  'gcp': 'Google Cloud',
  'github': 'GitHub',
  'vscode': 'VS Code',
  'figma': 'Figma',
};

/**
 * Normalize skill name to proper capitalization and format
 */
export function normalizeSkillName(name: string): string {
  if (!name) return '';
  
  const trimmed = name.trim();
  const lowerCase = trimmed.toLowerCase();
  
  // Check if there's a specific rule for this skill
  if (skillCapitalizationRules[lowerCase]) {
    return skillCapitalizationRules[lowerCase];
  }
  
  // Default: capitalize first letter of each word
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get auto-suggest matches for a skill name query
 */
export function getSkillSuggestions(query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return commonSkills
    .filter(skill => skill.toLowerCase().includes(lowerQuery))
    .slice(0, limit);
}

/**
 * Check if a skill name already exists in the list
 */
export function isSkillDuplicate(
  skillName: string,
  existingSkills: string[]
): boolean {
  const normalized = normalizeSkillName(skillName);
  return existingSkills.some(
    existing => normalizeSkillName(existing) === normalized
  );
}

// Proficiency level definitions
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface ProficiencyLevelInfo {
  level: ProficiencyLevel;
  label: string;
  description: string;
  range: [number, number];
}

/**
 * Proficiency level mappings with semantic descriptions
 */
export const proficiencyLevels: ProficiencyLevelInfo[] = [
  {
    level: 'beginner',
    label: 'Beginner',
    description: 'Learning fundamentals, exploring basics',
    range: [0, 24],
  },
  {
    level: 'intermediate',
    label: 'Intermediate',
    description: 'Comfortable with common tasks',
    range: [25, 59],
  },
  {
    level: 'advanced',
    label: 'Advanced',
    description: 'Used independently in real projects',
    range: [60, 84],
  },
  {
    level: 'expert',
    label: 'Expert',
    description: 'Deep expertise, can teach others',
    range: [85, 100],
  },
];

/**
 * Get proficiency level info based on numeric level (0-100)
 */
export function getProficiencyLevelInfo(level: number): ProficiencyLevelInfo {
  const info = proficiencyLevels.find(
    pl => level >= pl.range[0] && level <= pl.range[1]
  );
  return info || proficiencyLevels[0]; // Default to beginner if not found
}

/**
 * Get just the proficiency level label
 */
export function getLevelLabel(level: number): string {
  return getProficiencyLevelInfo(level).label;
}

/**
 * Get just the proficiency level description
 */
export function getLevelDescription(level: number): string {
  return getProficiencyLevelInfo(level).description;
}

/**
 * Calculate skill confidence based on proficiency level and context
 * 
 * Algorithm:
 * - Base score from proficiency level (0-100)
 * - Bonus +15 points if context is provided
 * - High: 75+, Medium: 40-74, Low: 0-39
 */
export function calculateConfidence(
  level: number,
  hasContext: boolean
): ConfidenceLevel {
  let score = level;
  
  // Boost score if user provided context about usage
  if (hasContext) {
    score = Math.min(100, score + 15);
  }
  
  if (score >= 75) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Get confidence level display information
 */
export interface ConfidenceLevelInfo {
  level: ConfidenceLevel;
  label: string;
  color: string;
  description: string;
}

export function getConfidenceLevelInfo(confidence: ConfidenceLevel): ConfidenceLevelInfo {
  const info: Record<ConfidenceLevel, ConfidenceLevelInfo> = {
    low: {
      level: 'low',
      label: 'Low',
      color: 'var(--text-tertiary)',
      description: 'Consider adding more context or adjusting proficiency',
    },
    medium: {
      level: 'medium',
      label: 'Medium',
      color: 'var(--warning-600)',
      description: 'Good signal — context would strengthen this',
    },
    high: {
      level: 'high',
      label: 'High',
      color: 'var(--success-600)',
      description: 'Strong signal — well-defined skill',
    },
  };
  
  return info[confidence];
}

/**
 * Validate skill name
 */
export function validateSkillName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Skill name is required';
  }
  
  if (name.length > 50) {
    return 'Skill name must be 50 characters or less';
  }
  
  // Check for invalid characters (only allow letters, spaces, dots, slashes, #, +)
  if (!/^[a-zA-Z0-9\s./#+-]+$/.test(name)) {
    return 'Skill name contains invalid characters';
  }
  
  return null; // Valid
}
