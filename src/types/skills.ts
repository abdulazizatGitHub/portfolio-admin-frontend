export interface Skill {
  id?: number;
  name: string;
  level: number; // 0-100
  category: 'technical' | 'ai';
  orderIndex: number;
}

