export type UserRole = 'admin' | 'instructor' | 'student' | 'reception';

export interface User {
  id: number;
  name: string;
  email: string;
  login_id: string;
  role: UserRole;
  instructor?: { id: number };
  student?: { id: number };
  created_at: string;
  updated_at: string;
}


export interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor?: {
    id: number;
    user: User;
  };
  price: number;
  status: 'active' | 'draft' | 'archived';
  duration?: string;
  lessons?: Lesson[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content?: string;
  video_url?: string;
  order: number;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  course?: Course;
  student?: User;
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date: string;
  max_grade: number;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_path: string;
  grade?: number;
  feedback?: string;
  submitted_at: string;
}

export interface Grade {
  id: number;
  student_id: number;
  course_id: number;
  assignment_id?: number;
  grade: number;
  type: 'assignment' | 'exam' | 'final';
}

export interface Payment {
  id: number;
  student_id: number;
  enrollment_id?: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  transaction_id?: string;
  status: 'pending' | 'paid' | 'failed' | 'completed';
  student?: {
    id: number;
    user: User;
  };
  created_at: string;
}

export interface Certificate {
  id: number;
  student_id: number;
  course_id: number;
  percentage: number;
  grade: string;
  issued_at: string;
  student?: {
    id: number;
    user: User;
  };
  course?: Course;
}
