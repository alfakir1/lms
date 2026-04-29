import api from './client';

export const dashboardApi = {
  getStats: () => api.get('/stats').then(r => r.data.data || r.data),
  getReports: () => api.get('/reports').then(r => r.data.data || r.data),
};
