import api, { unwrapPaginatedData } from './client';
import { Course } from '../types';

export const coursesApi = {
  getAll: () => api.get('/courses').then(r => unwrapPaginatedData<Course>(r.data)),
  getById: (id: number) => api.get<Course>(`/courses/${id}`).then(r => r.data),
  create: (data: Partial<Course>) => api.post<Course>('/courses', data).then(r => r.data),
  update: (id: number, data: Partial<Course>) => api.put<Course>(`/courses/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  enroll: (courseId: number) => api.post('/enrollments', { course_id: courseId }).then(r => r.data),
  myEnrollments: () => api.get('/enrollments/my').then(r => r.data),
  updateProgress: (lessonId: number, lastPosition: number, percentWatched: number) => 
    api.post('/lesson-progress', { lesson_id: lessonId, last_position: lastPosition, percent_watched: percentWatched }).then(r => r.data),
  getCourseProgress: (courseId: number) => 
    api.get(`/lesson-progress/course/${courseId}`).then(r => r.data),
  getReviews: (courseId: number) => 
    api.get(`/courses/${courseId}/reviews`).then(r => r.data),
  addReview: (courseId: number, rating: number, comment: string) => 
    api.post(`/courses/${courseId}/reviews`, { rating, comment }).then(r => r.data),
};
