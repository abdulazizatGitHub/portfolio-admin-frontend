export interface Skill {
  id?: number;
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'soft';
  orderIndex: number;
}

