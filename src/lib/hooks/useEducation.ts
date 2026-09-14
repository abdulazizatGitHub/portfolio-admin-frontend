import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { educationApi } from '@/lib/api/education.api';
import type { EducationEntry } from '@/types';

export function useEducation() {
  return useQuery<EducationEntry[]>({
    queryKey: ['education'],
    queryFn: educationApi.getAll,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<EducationEntry, 'id'>) => educationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducationEntry> }) =>
      educationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => educationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
  });
}
