import api, { toAssetUrl, toRelativeAssetPath } from './api';
import { categoriesApi } from './categories.api';
import { skillsApi } from './skills.api';
import type { Project, ProjectFormData, ProjectStatus } from '@/types';

interface BackendProject {
  id: string;
  title: string;
  short_description: string;
  description: string;
  thumbnail_url: string | null;
  status: 'LIVE' | 'DRAFT' | 'DEVELOPMENT' | 'ARCHIVED';
  start_date: string | null;
  end_date: string | null;
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
  is_published: boolean;
  order_index: number;
  category_id: string;
  category?: { id: string; name: string; slug: string };
  project_skills?: Array<{ skill: { id: string; name: string } }>;
  created_at: string;
  updated_at: string;
}

const STATUS_TO_BACKEND: Record<ProjectStatus, BackendProject['status']> = {
  live: 'LIVE',
  draft: 'DRAFT',
  development: 'DEVELOPMENT',
  archived: 'ARCHIVED',
};

const STATUS_FROM_BACKEND: Record<BackendProject['status'], ProjectStatus> = {
  LIVE: 'live',
  DRAFT: 'draft',
  DEVELOPMENT: 'development',
  ARCHIVED: 'archived',
};

const toProject = (dto: BackendProject): Project => ({
  id: dto.id,
  title: dto.title,
  shortDescription: dto.short_description,
  description: dto.description,
  techStack: (dto.project_skills ?? []).map((ps) => ps.skill.name),
  thumbnail: toAssetUrl(dto.thumbnail_url),
  liveUrl: dto.demo_url ?? undefined,
  githubUrl: dto.repo_url ?? undefined,
  category: dto.category?.name ?? '',
  status: STATUS_FROM_BACKEND[dto.status],
  featured: dto.featured,
  startDate: dto.start_date ?? '',
  endDate: dto.end_date,
  orderIndex: dto.order_index,
  isPublished: dto.is_published,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});

/**
 * Resolves the admin-facing free-text category + tech stack names into the
 * backend's relational category_id + skill_ids before create/update.
 */
const toBackendPayload = async (data: Partial<ProjectFormData>) => {
  const [category_id, skill_ids] = await Promise.all([
    data.category ? categoriesApi.resolveIdByName(data.category) : undefined,
    data.techStack ? skillsApi.resolveIdsByNames(data.techStack) : undefined,
  ]);

  return {
    title: data.title,
    short_description: data.shortDescription,
    description: data.description,
    thumbnail_url: toRelativeAssetPath(data.thumbnail),
    status: data.status ? STATUS_TO_BACKEND[data.status] : undefined,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    demo_url: data.liveUrl || null,
    repo_url: data.githubUrl || null,
    featured: data.featured,
    is_published: data.isPublished,
    category_id,
    skill_ids,
  };
};

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get('/projects', { params: { limit: 100 } });
    return (res.data.data as BackendProject[]).map(toProject);
  },

  getById: async (id: string): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return toProject(res.data.data);
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    const payload = await toBackendPayload(data);
    const res = await api.post('/projects', payload);
    return toProject(res.data.data);
  },

  update: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const payload = await toBackendPayload(data);
    const res = await api.patch(`/projects/${id}`, payload);
    return toProject(res.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  restore: async (id: string): Promise<Project> => {
    const res = await api.patch(`/projects/${id}/restore`);
    return toProject(res.data.data);
  },
};
