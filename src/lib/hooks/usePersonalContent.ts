import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { personalApi } from '@/lib/api/personal.api';
import type { PersonalProfile } from '@/types';

export function usePersonalContent() {
  return useQuery<PersonalProfile | null>({
    queryKey: ['personal'],
    queryFn: personalApi.getProfile,
  });
}

/**
 * Compatibility shim for pages built around a multi-profile list — the
 * backend only supports a single profile today, so this returns it as a
 * one-item (or empty) array.
 */
export function usePersonalProfiles() {
  const query = usePersonalContent();
  return {
    ...query,
    data: query.data ? [query.data] : query.data === null ? [] : undefined,
  };
}

export function useSavePersonalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, cvFile }: { data: PersonalProfile; cvFile?: File }) =>
      personalApi.saveProfile(data, cvFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
    },
  });
}
