import { useQuery } from '@tanstack/react-query';
import { fetchExperience } from '@/lib/data/mockData';
import type { ExperienceEntry } from '@/types';

export function useExperience() {
  return useQuery<ExperienceEntry[]>({
    queryKey: ['experience'],
    queryFn: fetchExperience,
  });
}

