import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import { ensurePaginated } from '../api/validate';

export type PaymentStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface Payment {
  id: number;
  user_id: number;
  course_id: number;
  amount: number;
  status: PaymentStatus;
  proof_url?: string;
  reference_code?: string;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
  course?: {
    id: number;
    title: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaymentFilters {
  status?: PaymentStatus;
  page?: number;
  per_page?: number;
}

export interface PaginatedPayments {
  data: Payment[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreatePaymentData {
  course_id: number;
  proof_file: File;
}

export const paymentService = {
  async getAll(filters?: PaymentFilters): Promise<PaginatedPayments> {
    const response = await api.get('/payments', { params: filters });
    return ensurePaginated<Payment>(unwrapApi<unknown>(response.data));
  },

  async create(data: CreatePaymentData): Promise<Payment> {
    const formData = new FormData();
    formData.append('course_id', String(data.course_id));
    formData.append('proof_file', data.proof_file);

    const response = await api.post('/payments', formData);
    return unwrapApi<Payment>(response.data);
  },

  async getLatestForCourse(courseId: number | string): Promise<Payment | null> {
    const response = await api.get(`/payments/course/${courseId}`);
    return unwrapApi<Payment | null>(response.data);
  },
};

export const adminPaymentService = {
  async getAll(filters?: PaymentFilters): Promise<PaginatedPayments> {
    const response = await api.get('/admin/payments', { params: filters });
    return ensurePaginated<Payment>(unwrapApi<unknown>(response.data));
  },

  async approve(paymentId: number): Promise<Payment> {
    const response = await api.post(`/admin/payments/${paymentId}/approve`);
    return unwrapApi<Payment>(response.data);
  },

  async reject(paymentId: number): Promise<Payment> {
    const response = await api.post(`/admin/payments/${paymentId}/reject`);
    return unwrapApi<Payment>(response.data);
  },
};
