import api from '../api/axios';
import { unwrapApi } from '../api/unwrap';
import { ensurePaginated } from '../api/validate';
import type { Course, Chapter, Lecture } from '../types';

export interface CourseFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const courseService = {
  async getAll(filters?: CourseFilters): Promise<PaginatedResponse<Course>> {
    const response = await api.get('/courses', { params: filters });
    return ensurePaginated<Course>(unwrapApi<unknown>(response.data));
  },

  async getById(id: number | string): Promise<Course> {
    const response = await api.get(`/courses/${id}`);
    return unwrapApi<Course>(response.data);
  },

  async create(data: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses', data);
    return unwrapApi<Course>(response.data);
  },

  async update(id: number | string, data: Partial<Course>): Promise<Course> {
    const response = await api.put(`/courses/${id}`, data);
    return unwrapApi<Course>(response.data);
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  async getChapters(courseId: number | string): Promise<Chapter[]> {
    const response = await api.get(`/courses/${courseId}/chapters`);
    return unwrapApi<Chapter[]>(response.data);
  },

  async createChapter(courseId: number | string, data: Partial<Chapter>): Promise<Chapter> {
    const response = await api.post(`/courses/${courseId}/chapters`, data);
    return unwrapApi<Chapter>(response.data);
  },

  async getLectures(chapterId: number | string): Promise<Lecture[]> {
    const response = await api.get(`/chapters/${chapterId}/lectures`);
    return unwrapApi<Lecture[]>(response.data);
  },

  async createLecture(chapterId: number | string, data: Partial<Lecture>): Promise<Lecture> {
    const response = await api.post(`/chapters/${chapterId}/lectures`, data);
    return unwrapApi<Lecture>(response.data);
  },

  async getLecture(lectureId: number | string): Promise<Lecture> {
    const response = await api.get(`/lectures/${lectureId}`);
    return unwrapApi<Lecture>(response.data);
  },

  async updateLecture(lectureId: number | string, data: Partial<Lecture>): Promise<Lecture> {
    const response = await api.put(`/lectures/${lectureId}`, data);
    return unwrapApi<Lecture>(response.data);
  },

  async deleteLecture(lectureId: number | string): Promise<void> {
    await api.delete(`/lectures/${lectureId}`);
  },

  async trackProgress(
    lectureId: number | string,
    payload: { watch_time: number; last_position: number; mark_completed?: boolean }
  ): Promise<void> {
    await api.post(`/lectures/${lectureId}/progress`, payload);
  },
};
