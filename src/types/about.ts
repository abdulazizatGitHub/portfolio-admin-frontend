export interface AboutStat {
  id?: string;
  label: string;
  value: string;
}

export interface AboutSection {
  id?: string;
  roleTitle: string;
  paragraphs: string[];
  stats: AboutStat[];
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy support
export type AboutContent = AboutSection;
