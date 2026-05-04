import api, { unwrapPaginatedData } from './client';
import { User } from '../types';

export const usersApi = {
  getAll: () => api.get('/users').then(r => unwrapPaginatedData<User>(r.data)),
  getById: (id: number) => api.get<User>(`/users/${id}`).then(r => r.data),
  create: (data: Partial<User> & { password: string }) =>
    api.post<User>('/users', data).then(r => r.data),
  update: (id: number, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/users/${id}`),
  getByRole: (role: string) => api.get('/users', { params: { role } }).then(r => unwrapPaginatedData<User>(r.data)),
};
