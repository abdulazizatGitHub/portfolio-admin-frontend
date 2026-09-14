import api from './api';
import { slugify } from '@/lib/utils/slugify';
import type { Skill, SkillFormData } from '@/types';

interface BackendSkill {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  category: string | null;
  level: number;
  context: string | null;
  related_tools: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

const toSkill = (dto: BackendSkill): Skill => ({
  id: dto.id,
  name: dto.name,
  level: dto.level,
  category: (dto.category?.toLowerCase() as Skill['category']) || 'technical',
  orderIndex: dto.order_index,
  context: dto.context ?? undefined,
  relatedTools: dto.related_tools,
});

const toBackendPayload = (data: Partial<SkillFormData> & { orderIndex?: number }) => ({
  name: data.name,
  category: data.category,
  level: data.level,
  context: data.context ?? null,
  order_index: data.orderIndex,
});

export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    const res = await api.get('/skills', { params: { limit: 100 } });
    return (res.data.data as BackendSkill[]).map(toSkill);
  },

  create: async (data: SkillFormData & { orderIndex?: number }): Promise<Skill> => {
    const res = await api.post('/skills', {
      ...toBackendPayload(data),
      slug: slugify(data.name),
    });
    return toSkill(res.data.data);
  },

  update: async (
    id: string,
    data: Partial<SkillFormData> & { orderIndex?: number }
  ): Promise<Skill> => {
    const res = await api.patch(`/skills/${id}`, toBackendPayload(data));
    return toSkill(res.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },

  uploadIcon: async (id: string, file: File): Promise<Skill> => {
    const formData = new FormData();
    formData.append('skill-icon', file);
    const res = await api.post(`/skills/${id}/icon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return toSkill(res.data.data);
  },

  /**
   * Resolve a list of tech-stack names to skill ids, creating any skill
   * that doesn't exist yet (Project.techStack is a free string list in the
   * admin model but a relational many-to-many on the backend).
   */
  resolveIdsByNames: async (names: string[]): Promise<string[]> => {
    if (names.length === 0) return [];
    const existing = await skillsApi.getAll();
    const ids: string[] = [];
    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const match = existing.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
      if (match?.id) {
        ids.push(match.id);
      } else {
        const created = await skillsApi.create({ name: trimmed, category: 'technical', level: 50 });
        if (created.id) ids.push(created.id);
      }
    }
    return ids;
  },
};
