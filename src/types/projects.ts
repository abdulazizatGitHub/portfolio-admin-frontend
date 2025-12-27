export interface Project {
  id?: number;
  title: string;
  description: string;
  tech: string[];
  imagePath: string;
  liveUrl?: string;
  sourceUrl?: string;
  orderIndex: number;
  isPublished: boolean;
}

