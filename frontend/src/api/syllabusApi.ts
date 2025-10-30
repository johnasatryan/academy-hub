import api from './index';
import { Syllabus } from './types';

const syllabusApi = {
  getAll: async (): Promise<Syllabus[]> => {
    const res = await api.get<Syllabus[]>('/syllabuses');
    return res.data;
  },

  getById: async (id: string): Promise<Syllabus> => {
    const res = await api.get<Syllabus>(`/syllabuses/${id}`);
    return res.data;
  },

  create: async (
    data: Omit<Syllabus, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Syllabus> => {
    const res = await api.post<Syllabus>('/syllabuses', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Syllabus>): Promise<Syllabus> => {
    const res = await api.put<Syllabus>(`/syllabuses/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/syllabuses/${id}`);
    return res.data;
  },
};

export default syllabusApi;
