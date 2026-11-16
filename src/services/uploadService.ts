// ============================================================
// LAVSA Web — Upload Service
// Uploads images to /api/upload using multipart/form-data
// ============================================================

import api from './api';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },
};
