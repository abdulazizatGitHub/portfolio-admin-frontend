import { useQuery } from '@tanstack/react-query';
import { fetchContactInfo, fetchSocialLinks } from '@/lib/data/mockData';
import type { ContactInfoItem, SocialLink } from '@/types';

export function useContactInfo() {
  return useQuery<ContactInfoItem[]>({
    queryKey: ['contactInfo'],
    queryFn: fetchContactInfo,
  });
}

export function useSocialLinks() {
  return useQuery<SocialLink[]>({
    queryKey: ['socialLinks'],
    queryFn: fetchSocialLinks,
  });
}

