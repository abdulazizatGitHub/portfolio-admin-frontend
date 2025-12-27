import { useQuery } from '@tanstack/react-query';
import { fetchAboutContent } from '@/lib/data/mockData';
import type { AboutContent } from '@/types';

export function useAboutContent() {
  return useQuery<AboutContent>({
    queryKey: ['about'],
    queryFn: fetchAboutContent,
  });
}

