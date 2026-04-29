import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/courses';
import { usersApi } from '../api/users';
import { Course } from '../types';

export const useCourses = () =>
  useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: coursesApi.getAll,
  });

export const useCourse = (id: number) =>
  useQuery<Course>({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      coursesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useEnroll = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments'] }),
  });
};

export const useInstructors = () =>
  useQuery<any[]>({
    queryKey: ['instructors'],
    queryFn: async () => {
      const users = await usersApi.getAll();
      return users.filter((u: any) => u.role === 'instructor');
    },
  });

export const useCourseProgress = (courseId: number) =>
  useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => coursesApi.getCourseProgress(courseId),
    enabled: !!courseId,
  });

export const useUpdateProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, lastPosition, percentWatched }: { lessonId: number, lastPosition: number, percentWatched: number }) =>
      coursesApi.updateProgress(lessonId, lastPosition, percentWatched),
    onSuccess: (_, variables) => {
      // Invalidate the specific course progress cache if we had a way to know courseId here,
      // but usually we can just invalidate all course-progress to be safe, or let the player handle local state
      qc.invalidateQueries({ queryKey: ['course-progress'] });
    },
  });
};
