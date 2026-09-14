import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '@/lib/api/contact.api';
import type { ContactInfoItem, SocialLink } from '@/types';

export function useContactInfo() {
  return useQuery<ContactInfoItem[]>({
    queryKey: ['contactInfo'],
    queryFn: contactApi.getInfoItems,
  });
}

export function useSocialLinks() {
  return useQuery<SocialLink[]>({
    queryKey: ['socialLinks'],
    queryFn: contactApi.getSocialLinks,
  });
}

export function useCreateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ContactInfoItem, 'id'>) => contactApi.createInfoItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactInfo'] }),
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactInfoItem> }) =>
      contactApi.updateInfoItem(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactInfo'] }),
  });
}

export function useDeleteContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.deleteInfoItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactInfo'] }),
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<SocialLink, 'id'>) => contactApi.createSocialLink(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialLinks'] }),
  });
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialLink> }) =>
      contactApi.updateSocialLink(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialLinks'] }),
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.deleteSocialLink(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialLinks'] }),
  });
}
