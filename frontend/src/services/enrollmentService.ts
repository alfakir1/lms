import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import { ensurePaginated } from '../api/validate';
import type { Enrollment, Course } from '../types';
import type { PaginatedData } from '../types/api';

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export const enrollmentService = {
  async getMyEnrollments(): Promise<EnrollmentWithCourse[]> {
    const response = await api.get('/enrollments/my');
    return unwrapApi<EnrollmentWithCourse[]>(response.data);
  },

  async enroll(courseId: number | string): Promise<Enrollment> {
    const response = await api.post(`/enrollments/courses/${courseId}`);
    return unwrapApi<Enrollment>(response.data);
  },

  async getPendingEnrollments(params?: { per_page?: number; page?: number }): Promise<PaginatedData<EnrollmentWithCourse>> {
    const response = await api.get('/enrollments/pending', { params });
    return ensurePaginated<EnrollmentWithCourse>(unwrapApi<unknown>(response.data));
  },

  async approve(enrollmentId: number | string): Promise<Enrollment> {
    const response = await api.post(`/enrollments/${enrollmentId}/approve`);
    return unwrapApi<Enrollment>(response.data);
  },

  async ban(enrollmentId: number | string): Promise<void> {
    await api.post(`/enrollments/${enrollmentId}/ban`);
  },
};
