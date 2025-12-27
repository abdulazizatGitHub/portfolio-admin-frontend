import { useQuery } from '@tanstack/react-query';
import { fetchPersonalContent } from '@/lib/data/mockData';
import type { PersonalContent } from '@/types';

export function usePersonalContent() {
  return useQuery<PersonalContent>({
    queryKey: ['personal'],
    queryFn: fetchPersonalContent,
  });
}

