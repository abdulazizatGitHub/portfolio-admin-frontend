import { useQuery } from '@tanstack/react-query';
import { fetchAboutSections } from '@/lib/data/mockData';
import type { AboutSection } from '@/types';

export function useAboutContent() {
  return useQuery<AboutSection[]>({
    queryKey: ['about-sections'],
    queryFn: fetchAboutSections,
  });
}

