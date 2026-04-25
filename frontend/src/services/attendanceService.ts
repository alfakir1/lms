import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import type { AttendanceSession, Attendance } from '../types';

export const attendanceService = {
  // Instructor actions
  async startSession(courseId: number | string): Promise<AttendanceSession> {
    const response = await api.post(`/attendance/sessions/courses/${courseId}/start`);
    return unwrapApi<AttendanceSession>(response.data);
  },

  async closeSession(sessionId: number | string): Promise<AttendanceSession> {
    const response = await api.post(`/attendance/sessions/${sessionId}/close`);
    return unwrapApi<AttendanceSession>(response.data);
  },

  async recordManual(sessionId: number | string, data: { student_id: number; status: string }): Promise<Attendance> {
    const response = await api.post(`/attendance/sessions/${sessionId}/manual`, data);
    return unwrapApi<Attendance>(response.data);
  },

  async getSessionReport(sessionId: number | string): Promise<any> {
    const response = await api.get(`/attendance/sessions/${sessionId}/report`);
    return unwrapApi<any>(response.data);
  },

  // Student actions
  async requestToken(sessionId: number | string): Promise<{ token: string; expires_at: string }> {
    const response = await api.post(`/attendance/sessions/${sessionId}/request-token`);
    return unwrapApi<{ token: string; expires_at: string }>(response.data);
  },

  async scanToken(token: string): Promise<{ message: string }> {
    const response = await api.post('/attendance/scan', { token });
    return unwrapApi<{ message: string }>(response.data);
  },
};
