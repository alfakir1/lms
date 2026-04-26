import api from './client';
import { Grade } from '../types';

export const gradesApi = {
  getAll: () => api.get<Grade[]>('/grades').then(r => (r.data as any).data || r.data),
  getByStudent: (studentId: number) => api.get<Grade[]>(`/grades?student_id=${studentId}`).then(r => (r.data as any).data || r.data),
  getByCourse: (courseId: number) => api.get<Grade[]>(`/grades?course_id=${courseId}`).then(r => (r.data as any).data || r.data),
  create: (data: Partial<Grade>) => api.post<Grade>('/grades', data).then(r => (r.data as any).data || r.data),
  update: (id: number, data: Partial<Grade>) => api.put<Grade>(`/grades/${id}`, data).then(r => (r.data as any).data || r.data),
};
