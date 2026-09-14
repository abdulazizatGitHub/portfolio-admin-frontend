import api from './api';
import type { EducationEntry } from '@/types';

interface BackendEducation {
  id: string;
  period: string;
  title: string;
  description: string;
  order_index: number;
}

const toEducation = (dto: BackendEducation): EducationEntry => ({
  id: dto.id,
  period: dto.period,
  title: dto.title,
  description: dto.description,
  orderIndex: dto.order_index,
});

const toBackendPayload = (data: Partial<EducationEntry>) => ({
  period: data.period,
  title: data.title,
  description: data.description,
  order_index: data.orderIndex,
});

export const educationApi = {
  getAll: async (): Promise<EducationEntry[]> => {
    const res = await api.get('/timeline/education');
    return (res.data.data as BackendEducation[]).map(toEducation);
  },

  create: async (data: Omit<EducationEntry, 'id'>): Promise<EducationEntry> => {
    const res = await api.post('/timeline/education', toBackendPayload(data));
    return toEducation(res.data.data);
  },

  update: async (id: string, data: Partial<EducationEntry>): Promise<EducationEntry> => {
    const res = await api.patch(`/timeline/education/${id}`, toBackendPayload(data));
    return toEducation(res.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/timeline/education/${id}`);
  },
};
