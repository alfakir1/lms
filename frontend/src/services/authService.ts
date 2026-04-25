import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  role?: 'student' | 'instructor';
  device_uuid?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return unwrapApi<AuthResponse>(response.data);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return unwrapApi<AuthResponse>(response.data);
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return unwrapApi<User>(response.data);
  },

  async updateFingerprint(fingerprint: string): Promise<void> {
    await api.post('/auth/update-fingerprint', { fingerprint_hash: fingerprint });
  },
};
