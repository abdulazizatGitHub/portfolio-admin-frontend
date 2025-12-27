import { useQuery } from '@tanstack/react-query';
import { fetchEducation } from '@/lib/data/mockData';
import type { EducationEntry } from '@/types';

export function useEducation() {
  return useQuery<EducationEntry[]>({
    queryKey: ['education'],
    queryFn: fetchEducation,
  });
}

