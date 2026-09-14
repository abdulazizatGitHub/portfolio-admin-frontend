import api from './api';
import type { ContactInfoItem, SocialLink } from '@/types';

interface BackendInfoItem {
  id: string;
  type: string;
  label: string;
  value: string;
  href: string | null;
  order_index: number;
}

interface BackendSocialLink {
  id: string;
  platform: string;
  url: string;
  order_index: number;
}

const toInfoItem = (dto: BackendInfoItem): ContactInfoItem => ({
  id: dto.id,
  type: dto.type as ContactInfoItem['type'],
  label: dto.label,
  value: dto.value,
  href: dto.href ?? undefined,
  orderIndex: dto.order_index,
});

const toSocialLink = (dto: BackendSocialLink): SocialLink => ({
  id: dto.id,
  platform: dto.platform,
  url: dto.url,
  orderIndex: dto.order_index,
});

export const contactApi = {
  getInfoItems: async (): Promise<ContactInfoItem[]> => {
    const res = await api.get('/contact');
    return (res.data.data.infoItems ?? []).map(toInfoItem);
  },

  getSocialLinks: async (): Promise<SocialLink[]> => {
    const res = await api.get('/contact');
    return (res.data.data.socialLinks ?? []).map(toSocialLink);
  },

  createInfoItem: async (data: Omit<ContactInfoItem, 'id'>): Promise<ContactInfoItem> => {
    const res = await api.post('/contact/info', {
      type: data.type,
      label: data.label,
      value: data.value,
      href: data.href || null,
      order_index: data.orderIndex,
    });
    return toInfoItem(res.data.data);
  },

  updateInfoItem: async (id: string, data: Partial<ContactInfoItem>): Promise<ContactInfoItem> => {
    const res = await api.patch(`/contact/info/${id}`, {
      type: data.type,
      label: data.label,
      value: data.value,
      href: data.href || null,
      order_index: data.orderIndex,
    });
    return toInfoItem(res.data.data);
  },

  deleteInfoItem: async (id: string): Promise<void> => {
    await api.delete(`/contact/info/${id}`);
  },

  createSocialLink: async (data: Omit<SocialLink, 'id'>): Promise<SocialLink> => {
    const res = await api.post('/contact/socials', {
      platform: data.platform,
      url: data.url,
      order_index: data.orderIndex,
    });
    return toSocialLink(res.data.data);
  },

  updateSocialLink: async (id: string, data: Partial<SocialLink>): Promise<SocialLink> => {
    const res = await api.patch(`/contact/socials/${id}`, {
      platform: data.platform,
      url: data.url,
      order_index: data.orderIndex,
    });
    return toSocialLink(res.data.data);
  },

  deleteSocialLink: async (id: string): Promise<void> => {
    await api.delete(`/contact/socials/${id}`);
  },
};
