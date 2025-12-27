import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '@/lib/data/mockData';
import type { Skill } from '@/types';

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });
}

