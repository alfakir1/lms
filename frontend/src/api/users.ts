import api from './client';
import { User } from '../types';

export const usersApi = {
  getAll: () => api.get<User[]>('/users').then(r => (r.data as any).data || r.data),
  getById: (id: number) => api.get<User>(`/users/${id}`).then(r => (r.data as any).data || r.data),
  create: (data: Partial<User> & { password: string }) =>
    api.post<User>('/users', data).then(r => (r.data as any).data || r.data),
  update: (id: number, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data).then(r => (r.data as any).data || r.data),
  delete: (id: number) => api.delete(`/users/${id}`),
  getByRole: (role: string) => api.get<User[]>(`/users?role=${role}`).then(r => (r.data as any).data || r.data),
};
