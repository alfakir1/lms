import api from './client';
import { Payment } from '../types';

export const paymentsApi = {
  getAll: (): Promise<Payment[]> => api.get('/payments').then(r => r.data.data || r.data),
  getById: (id: number): Promise<Payment> => api.get(`/payments/${id}`).then(r => r.data.data || r.data),
  create: (data: Partial<Payment>): Promise<Payment> => api.post('/payments', data).then(r => r.data.data || r.data),
  approve: (id: number): Promise<Payment> => api.post(`/payments/${id}/approve`).then(r => r.data.data || r.data),
  getReceipt: (paymentId: number) =>
    api.get(`/payments/${paymentId}/receipt`, { responseType: 'blob' }).then(r => r.data),
};
