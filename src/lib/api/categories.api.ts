import api from './api';
import { slugify } from '@/lib/utils/slugify';

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
}

/**
 * Categories have no dedicated admin UI yet — Project.category is a free-text
 * string in the admin model but a relational FK on the backend. This module
 * resolves a category name to an id, creating the category on first use.
 */
export const categoriesApi = {
  list: async (): Promise<BackendCategory[]> => {
    const res = await api.get('/categories', { params: { limit: 100 } });
    return res.data.data;
  },

  create: async (name: string): Promise<BackendCategory> => {
    const res = await api.post('/categories', { name, slug: slugify(name) });
    return res.data.data;
  },

  resolveIdByName: async (name: string): Promise<string> => {
    const trimmed = name.trim();
    const categories = await categoriesApi.list();
    const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing.id;
    const created = await categoriesApi.create(trimmed);
    return created.id;
  },
};
