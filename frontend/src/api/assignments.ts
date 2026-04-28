import api from './client';
import { Assignment, Submission } from '../types';

export const assignmentsApi = {
  getAll: () => api.get<Assignment[]>('/assignments').then(r => (r.data as any).data || r.data),
  getById: (id: number) => api.get<Assignment>(`/assignments/${id}`).then(r => (r.data as any).data || r.data),
  create: (data: Partial<Assignment>) => api.post<Assignment>('/assignments', data).then(r => (r.data as any).data || r.data),
  update: (id: number, data: Partial<Assignment>) => api.put<Assignment>(`/assignments/${id}`, data).then(r => (r.data as any).data || r.data),
  delete: (id: number) => api.delete(`/assignments/${id}`),
  submit: (assignmentId: number, file: File, notes?: string) => {
    const formData = new FormData();
    formData.append('assignment_id', String(assignmentId));
    formData.append('file', file);
    if (notes) formData.append('notes', notes);
    return api.post<Submission>('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => (r.data as any).data || r.data);
  },
  getSubmissions: (assignmentId: number) =>
    api.get<Submission[]>(`/assignments/${assignmentId}/submissions`).then(r => (r.data as any).data || r.data),
  gradeSubmission: (submissionId: number, grade: number, feedback?: string) =>
    api.put(`/submissions/${submissionId}/grade`, { grade, feedback }).then(r => (r.data as any).data || r.data),
};
