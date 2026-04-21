export interface User {
  id: number;
  name: string;
  email: string;
  student_id?: string;
  role: 'admin' | 'super_admin' | 'instructor' | 'student' | 'reception';
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  user: User;
  enrollments: Enrollment[];
}

export interface Instructor {
  id: number;
  user_id: number;
  user: User;
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor: Instructor;
  price: number;
  duration: string;
  lessons: Lesson[];
  enrollments: Enrollment[];
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  progress: number;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order: number;
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date: string;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  submitted_at: string;
  grade?: number;
}

export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: 'present' | 'absent';
}

export interface Payment {
  id: number;
  student_id: number;
  course_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Certificate {
  id: number;
  student_id: number;
  course_id: number;
  issued_at: string;
  certificate_url: string;
}