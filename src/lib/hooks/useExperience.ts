import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { experienceApi } from '@/lib/api/experience.api';
import type { ExperienceEntry, ExperienceRole } from '@/types';

export function useExperience() {
  return useQuery<ExperienceEntry[]>({
    queryKey: ['experience'],
    queryFn: experienceApi.getAll,
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ExperienceEntry, 'id' | 'overallPeriod'>) => experienceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExperienceEntry> }) =>
      experienceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}

export function useCreateExperienceRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      experienceId,
      role,
    }: {
      experienceId: string;
      role: Omit<ExperienceRole, 'id' | 'isCurrent'>;
    }) => experienceApi.createRole(experienceId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}

export function useUpdateExperienceRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, role }: { roleId: string; role: Partial<ExperienceRole> }) =>
      experienceApi.updateRole(roleId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}

export function useDeleteExperienceRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => experienceApi.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
}
