import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '../api/assignments';
import { gradesApi } from '../api/grades';
import { paymentsApi } from '../api/payments';
import { usersApi } from '../api/users';

/* ─── Assignments ─── */
export const useAssignments = () =>
  useQuery({ queryKey: ['assignments'], queryFn: assignmentsApi.getAll });

export const useAssignment = (id: number) =>
  useQuery({ queryKey: ['assignments', id], queryFn: () => assignmentsApi.getById(id), enabled: !!id });

export const useSubmitAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file, notes }: { id: number; file: File; notes?: string }) =>
      assignmentsApi.submit(id, file, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  });
};

export const useCreateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  });
};

/* ─── Grades ─── */
export const useGrades = () =>
  useQuery({ queryKey: ['grades'], queryFn: gradesApi.getAll });

export const useGradesByCourse = (courseId: number) =>
  useQuery({ queryKey: ['grades', 'course', courseId], queryFn: () => gradesApi.getByCourse(courseId), enabled: !!courseId });

export const useCreateGrade = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gradesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }),
  });
};

/* ─── Payments ─── */
export const usePayments = () =>
  useQuery({ queryKey: ['payments'], queryFn: paymentsApi.getAll });

export const useCreatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useApprovePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentsApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};

/* ─── Users ─── */
export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};
