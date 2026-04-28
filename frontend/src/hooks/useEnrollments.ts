import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi, Enrollment } from '../api/enrollments';

export const useEnrollments = (courseId?: number) =>
  useQuery<Enrollment[]>({
    queryKey: ['enrollments', courseId],
    queryFn: () => enrollmentsApi.getAll({ course_id: courseId }),
  });


export const useUpdateEnrollmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      enrollmentsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments'] }),
  });
};
