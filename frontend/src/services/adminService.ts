import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import type { AdminStats } from '../types';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return unwrapApi<AdminStats>(response.data);
  },

  async getUsers(params?: any): Promise<any> {
    const response = await api.get('/admin/users', { params });
    return unwrapApi<any>(response.data);
  },

  async updateUser(id: number, data: any): Promise<any> {
    const response = await api.put(`/admin/users/${id}`, data);
    return unwrapApi<any>(response.data);
  }
};

