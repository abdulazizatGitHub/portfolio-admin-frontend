import api from './api';

export const uploadsApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.url as string;
  },

  uploadCv: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('cv', file);
    const res = await api.post('/uploads/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { url: res.data.data.url, filename: res.data.data.filename };
  },
};
