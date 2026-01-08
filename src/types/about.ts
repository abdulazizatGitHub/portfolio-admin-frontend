export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutSection {
  id?: number;
  roleTitle: string;
  paragraphs: string[];
  stats: AboutStat[];
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy support
export type AboutContent = AboutSection;

