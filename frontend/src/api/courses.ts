import api from './client';
import { Course } from '../types';

export const coursesApi = {
  getAll: () => api.get<Course[]>('/courses').then(r => (r.data as any).data || r.data),
  getById: (id: number) => api.get<Course>(`/courses/${id}`).then(r => (r.data as any).data || r.data),
  create: (data: Partial<Course>) => api.post<Course>('/courses', data).then(r => (r.data as any).data || r.data),
  update: (id: number, data: Partial<Course>) => api.put<Course>(`/courses/${id}`, data).then(r => (r.data as any).data || r.data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  enroll: (courseId: number) => api.post('/enrollments', { course_id: courseId }).then(r => (r.data as any).data || r.data),
  myEnrollments: () => api.get('/enrollments/my').then(r => (r.data as any).data || r.data),
  updateProgress: (lessonId: number, lastPosition: number, percentWatched: number) => 
    api.post('/lesson-progress', { lesson_id: lessonId, last_position: lastPosition, percent_watched: percentWatched }).then(r => r.data),
  getCourseProgress: (courseId: number) => 
    api.get(`/lesson-progress/course/${courseId}`).then(r => (r.data as any).data || r.data),
};
