import api, { toAssetUrl, toRelativeAssetPath } from './api';
import { uploadsApi } from './uploads.api';
import type { PersonalProfile } from '@/types';

interface BackendPersonal {
  id: string;
  name: string;
  title_prefix: string;
  description: string;
  profile_image_url: string | null;
  cv_file_path: string;
  cv_download_name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface BackendJobRole {
  id: string;
  label: string;
  order_index: number;
}

/**
 * The backend models one PersonalContent singleton (+ a separate JobRole
 * list); the admin UI's multi-profile concept isn't backed by the API yet,
 * so this module exposes the single real profile.
 */
export const personalApi = {
  getProfile: async (): Promise<PersonalProfile | null> => {
    try {
      const [contentRes, rolesRes] = await Promise.all([
        api.get('/personal'),
        api.get('/personal/roles'),
      ]);
      const content: BackendPersonal = contentRes.data.data;
      const roles: BackendJobRole[] = rolesRes.data.data;
      return {
        id: content.id,
        name: content.name,
        titlePrefix: content.title_prefix,
        description: content.description,
        roles: [...roles].sort((a, b) => a.order_index - b.order_index).map((r) => r.label),
        cvFile: toAssetUrl(content.cv_file_path),
        cvFileName: content.cv_file_path?.split('/').pop() || undefined,
        cvDownloadName: content.cv_download_name,
        isDefault: content.is_default,
        createdAt: content.created_at,
        updatedAt: content.updated_at,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  saveProfile: async (data: PersonalProfile, cvFile?: File): Promise<PersonalProfile> => {
    const cvPath = cvFile
      ? (await uploadsApi.uploadCv(cvFile)).url
      : toRelativeAssetPath(data.cvFile);

    await api.put('/personal', {
      name: data.name,
      title_prefix: data.titlePrefix,
      description: data.description,
      cv_file_path: cvPath || undefined,
      cv_download_name: data.cvDownloadName,
    });

    // Full-replace job roles to match the submitted order/list.
    const existingRoles: BackendJobRole[] = (await api.get('/personal/roles')).data.data;
    await Promise.all(existingRoles.map((r) => api.delete(`/personal/roles/${r.id}`)));
    await Promise.all(
      data.roles.map((label, index) => api.post('/personal/roles', { label, order_index: index }))
    );

    return (await personalApi.getProfile()) as PersonalProfile;
  },
};
