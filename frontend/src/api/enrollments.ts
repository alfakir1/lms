import api, { unwrapPaginatedData } from './client';

export interface Enrollment {
  id: number;
  course_id: number;
  student_id: number;
  status: string;
  payment_status: string;
  course?: {
    id: number;
    title: string;
    progress?: number;
  };
  student?: {
    id: number;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export const enrollmentsApi = {
  getAll: (params?: { course_id?: number }) => api.get('/enrollments', { params }).then(r => unwrapPaginatedData<Enrollment>(r.data)),
  updateStatus: (id: number, status: string) => api.put(`/enrollments/${id}`, { status }),
};

