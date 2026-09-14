import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import type { AboutSection } from '@/types';

export function useAboutContent() {
  return useQuery<AboutSection[]>({
    queryKey: ['about-sections'],
    queryFn: aboutApi.getAll,
  });
}

export function useCreateAboutSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AboutSection, 'id' | 'createdAt' | 'updatedAt'>) =>
      aboutApi.createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
    },
  });
}

export function useUpdateAboutSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AboutSection> }) =>
      aboutApi.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
    },
  });
}

export function useDeleteAboutSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aboutApi.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
    },
  });
}
