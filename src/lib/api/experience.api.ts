import api from './api';
import { calculateOverallPeriod } from '@/lib/utils/experienceHelpers';
import type { EmploymentType, ExperienceEntry, ExperienceRole } from '@/types';

interface BackendRole {
  id: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  description: string;
  order_index: number;
}

interface BackendExperience {
  id: string;
  organization: string;
  location: string | null;
  employment_type: string | null;
  summary: string | null;
  order_index: number;
  roles: BackendRole[];
}

const toYearMonth = (isoDate: string): string => isoDate.slice(0, 7);

const toRole = (dto: BackendRole): ExperienceRole => ({
  id: dto.id,
  jobTitle: dto.job_title,
  startDate: toYearMonth(dto.start_date),
  endDate: dto.end_date ? toYearMonth(dto.end_date) : null,
  isCurrent: !dto.end_date,
  description: dto.description,
  orderIndex: dto.order_index,
});

const toExperience = (dto: BackendExperience): ExperienceEntry => {
  const entry: ExperienceEntry = {
    id: dto.id,
    organization: dto.organization,
    location: dto.location ?? undefined,
    employmentType: (dto.employment_type?.toLowerCase() as EmploymentType) ?? undefined,
    summary: dto.summary ?? undefined,
    roles: (dto.roles ?? []).map(toRole),
    overallPeriod: '',
    orderIndex: dto.order_index,
  };
  entry.overallPeriod = calculateOverallPeriod(entry);
  return entry;
};

const roleToBackend = (role: Partial<ExperienceRole>) => ({
  job_title: role.jobTitle,
  start_date: role.startDate ? `${role.startDate}-01` : undefined,
  end_date: role.endDate ? `${role.endDate}-01` : null,
  description: role.description,
  order_index: role.orderIndex ?? 0,
});

const toBackendPayload = (data: Partial<ExperienceEntry>) => ({
  organization: data.organization,
  location: data.location || undefined,
  employment_type: data.employmentType ? data.employmentType.toUpperCase() : undefined,
  summary: data.summary || undefined,
  order_index: data.orderIndex,
  roles: data.roles?.map(roleToBackend),
});

export const experienceApi = {
  getAll: async (): Promise<ExperienceEntry[]> => {
    const res = await api.get('/timeline/experience');
    return (res.data.data as BackendExperience[]).map(toExperience);
  },

  create: async (data: Omit<ExperienceEntry, 'id' | 'overallPeriod'>): Promise<ExperienceEntry> => {
    const res = await api.post('/timeline/experience', toBackendPayload(data));
    return toExperience(res.data.data);
  },

  update: async (id: string, data: Partial<ExperienceEntry>): Promise<ExperienceEntry> => {
    const { roles, ...organization } = toBackendPayload(data);
    await api.patch(`/timeline/experience/${id}`, organization);

    if (data.roles) {
      // Full-replace: simplest correct way to sync a role list that may
      // have had entries added, removed, or reordered by the form.
      const current: BackendExperience = (await api.get('/timeline/experience')).data.data.find(
        (e: BackendExperience) => e.id === id
      );

      await Promise.all(
        (current?.roles ?? []).map((r) => api.delete(`/timeline/experience/roles/${r.id}`))
      );
      await Promise.all(
        data.roles.map((role) => api.post(`/timeline/experience/${id}/roles`, roleToBackend(role)))
      );
    }

    const res = await api.get('/timeline/experience');
    return toExperience(res.data.data.find((e: BackendExperience) => e.id === id));
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/timeline/experience/${id}`);
  },

  createRole: async (
    experienceId: string,
    role: Omit<ExperienceRole, 'id' | 'isCurrent'>
  ): Promise<ExperienceRole> => {
    const res = await api.post(`/timeline/experience/${experienceId}/roles`, roleToBackend(role));
    return toRole(res.data.data);
  },

  updateRole: async (roleId: string, role: Partial<ExperienceRole>): Promise<ExperienceRole> => {
    const res = await api.patch(`/timeline/experience/roles/${roleId}`, roleToBackend(role));
    return toRole(res.data.data);
  },

  deleteRole: async (roleId: string): Promise<void> => {
    await api.delete(`/timeline/experience/roles/${roleId}`);
  },
};
