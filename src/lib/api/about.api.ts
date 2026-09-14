import api from './api';
import type { AboutSection, AboutStat } from '@/types';

interface BackendParagraph {
  id: string;
  content: string;
  order_index: number;
}

interface BackendStat {
  id: string;
  label: string;
  value: string;
  order_index: number;
}

interface BackendSection {
  id: string;
  role_title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  paragraphs: BackendParagraph[];
  stats: BackendStat[];
}

const toSection = (dto: BackendSection): AboutSection => ({
  id: dto.id,
  roleTitle: dto.role_title,
  paragraphs: [...dto.paragraphs]
    .sort((a, b) => a.order_index - b.order_index)
    .map((p) => p.content),
  stats: [...dto.stats]
    .sort((a, b) => a.order_index - b.order_index)
    .map((s) => ({ id: s.id, label: s.label, value: s.value })),
  orderIndex: dto.order_index,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});

const fetchSectionRaw = async (id: string): Promise<BackendSection> => {
  const res = await api.get('/about');
  const section = (res.data.data as BackendSection[]).find((s) => s.id === id);
  if (!section) throw new Error('About section not found');
  return section;
};

export const aboutApi = {
  getAll: async (): Promise<AboutSection[]> => {
    const res = await api.get('/about');
    return (res.data.data as BackendSection[])
      .sort((a, b) => a.order_index - b.order_index)
      .map(toSection);
  },

  createSection: async (
    data: Omit<AboutSection, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<AboutSection> => {
    const res = await api.post('/about/sections', {
      role_title: data.roleTitle,
      order_index: data.orderIndex,
    });
    const section: BackendSection = { ...res.data.data, paragraphs: [], stats: [] };
    await replaceParagraphsAndStats(section.id, data.paragraphs, data.stats);
    return toSection(await fetchSectionRaw(section.id));
  },

  updateSection: async (id: string, data: Partial<AboutSection>): Promise<AboutSection> => {
    if (data.roleTitle !== undefined || data.orderIndex !== undefined) {
      await api.patch(`/about/sections/${id}`, {
        role_title: data.roleTitle,
        order_index: data.orderIndex,
      });
    }

    if (data.paragraphs !== undefined || data.stats !== undefined) {
      const current = await fetchSectionRaw(id);
      await replaceParagraphsAndStats(
        id,
        data.paragraphs ?? current.paragraphs.map((p) => p.content),
        data.stats ?? current.stats.map((s) => ({ id: s.id, label: s.label, value: s.value })),
        current
      );
    }

    return toSection(await fetchSectionRaw(id));
  },

  deleteSection: async (id: string): Promise<void> => {
    await api.delete(`/about/sections/${id}`);
  },
};

/**
 * The admin form edits paragraphs/stats as plain arrays without stable ids
 * for paragraphs, so the simplest correct strategy is: delete everything
 * that existed for this section and recreate from the submitted arrays.
 */
async function replaceParagraphsAndStats(
  sectionId: string,
  paragraphs: string[],
  stats: AboutStat[],
  existing?: BackendSection
) {
  const current = existing ?? (await fetchSectionRaw(sectionId));

  await Promise.all([
    ...current.paragraphs.map((p) => api.delete(`/about/paragraphs/${p.id}`)),
    ...current.stats.map((s) => api.delete(`/about/stats/${s.id}`)),
  ]);

  await Promise.all([
    ...paragraphs.map((content, index) =>
      api.post(`/about/sections/${sectionId}/paragraphs`, { content, order_index: index })
    ),
    ...stats.map((stat, index) =>
      api.post(`/about/sections/${sectionId}/stats`, {
        label: stat.label,
        value: stat.value,
        order_index: index,
      })
    ),
  ]);
}
