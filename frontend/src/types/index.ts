export type UserRole = 'admin' | 'super_admin' | 'instructor' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: number;
  user_id: number;
  user: User;
}

export interface LectureProgress {
  id: number;
  user_id: number;
  lecture_id: number;
  watch_time: number;
  last_position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lecture {
  id: number;
  chapter_id: number;
  title: string;
  slug?: string | null;
  content_type: 'video' | 'text' | 'pdf' | 'document' | (string & {});
  content_url?: string | null;
  secure_content_url?: string;
  duration?: number | null; // minutes (per backend migration)
  order_index: number;
  status: string;
  progress?: LectureProgress | null;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  slug?: string | null;
  order_index: number;
  status: string;
  lectures?: Lecture[];
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  instructor_id: number;
  title: string;
  description?: string | null;
  price: number;
  slug: string;
  release_date?: string | null;
  status: string;
  instructor?: Instructor;
  chapters?: Chapter[];
  created_at: string;
  updated_at: string;
}

export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'banned' | (string & {});
export type EnrollmentPaymentStatus = 'unpaid' | 'paid' | (string & {});

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  payment_status: EnrollmentPaymentStatus;
  status: EnrollmentStatus;
  enrolled_at: string;
  ban_reason?: string | null;
  ban_document?: string | null;
  course?: Course;
  progress_percent?: number; // added by backend aggregation for dashboard UX
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface Payment {
  id: number;
  user_id: number;
  course_id: number;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  proof_image?: string | null;
  proof_url?: string | null;
  reference_code?: string | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  course?: Pick<Course, 'id' | 'title'>;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  total_courses: number;
  total_revenue: number;
  active_students: number;
  pending_enrollments: number;
  recent_activities: Array<{ id: number; type: string; message: string; time: string }>;
}
