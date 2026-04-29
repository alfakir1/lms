declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export type UserRole = 'admin' | 'instructor' | 'student' | 'reception';

export interface User {
  id: number;
  name: string;
  email: string;
  login_id: string;
  role: UserRole;
  is_active?: boolean;
  instructor?: { id: number };
  student?: { id: number };
  created_at: string;
  updated_at: string;
}


export interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number | null;
  instructor?: {
    id: number;
    user: User;
  };
  price: number;
  status: 'active' | 'draft' | 'archived' | 'upcoming' | 'completed';
  duration?: string;
  duration_days?: number;
  min_students?: number;
  max_students?: number;
  start_date?: string;
  end_date?: string;
  lessons?: Lesson[];
  parent_id?: number | null;
  group_name?: string | null;
  instances?: Course[];
  enrollments?: Enrollment[];
  assignments?: Assignment[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content?: string;
  video_url?: string;
  video_type?: 'html5' | 'youtube' | 'vimeo' | 'file';
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
  lesson_id?: number | null;
  title: string;
  description: string;
  due_date: string;
  deadline: string;
  max_grade: number;
  file_url?: string;
  course?: Course;
  lesson?: Lesson;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_url: string;
  content?: string;
  notes?: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
  submitted_at: string;
  student?: {
    id: number;
    user: User;
  };
  assignment?: Assignment;
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
