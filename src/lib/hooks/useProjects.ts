import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/data/mockData';
import type { Project } from '@/types';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}

