import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api/skills.api';
import type { Skill, SkillFormData } from '@/types';

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: skillsApi.getAll,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SkillFormData & { orderIndex?: number }) => skillsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SkillFormData> & { orderIndex?: number };
    }) => skillsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUploadSkillIcon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => skillsApi.uploadIcon(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
