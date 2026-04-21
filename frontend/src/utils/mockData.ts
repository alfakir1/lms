// ============================
// FOUR ACADEMY — MOCK DATA
// ============================

// Inline type definitions to avoid circular import issues
export interface UserRecord {
  id: number;
  student_id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin' | 'instructor' | 'student' | 'reception';
  created_at: string;
  updated_at: string;
}

export interface CourseRecord {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor: any;
  price: number;
  duration: string;
  lessons: LessonRecord[];
  enrollments: EnrollmentRecord[];
}

export interface LessonRecord {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order: number;
}

export interface EnrollmentRecord {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  progress: number;
  course?: CourseRecord;
}

export interface AssignmentRecord {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date: string;
}

export interface SubmissionRecord {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  submitted_at: string;
  grade?: number;
}

export interface PaymentRecord {
  id: number;
  student_id: number;
  course_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

// ── USERS ──────────────────────────────────────────────
export const mockUsers: UserRecord[] = [
  {
    id: 1,
    student_id: 'STU-1001',
    name: 'John Student',
    email: 'student@four.com',
    password: 'password123',
    role: 'student',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    student_id: 'STU-1002',
    name: 'Alice Smith',
    email: 'alice@four.com',
    password: 'password123',
    role: 'student',
    created_at: '2024-01-02',
    updated_at: '2024-01-02'
  },
  {
    id: 3,
    student_id: 'STU-1003',
    name: 'Bob Wilson',
    email: 'bob@four.com',
    password: 'password123',
    role: 'student',
    created_at: '2024-01-03',
    updated_at: '2024-01-03'
  },
  {
    id: 4,
    student_id: 'STU-1004',
    name: 'Emma Davis',
    email: 'emma@four.com',
    password: 'password123',
    role: 'student',
    created_at: '2024-01-04',
    updated_at: '2024-01-04'
  },
  {
    id: 5,
    name: 'Dr. Sarah Ahmed',
    email: 'sarah@four.com',
    password: 'password123',
    role: 'instructor',
    created_at: '2023-12-01',
    updated_at: '2023-12-01'
  },
  {
    id: 6,
    name: 'Eng. Omar Khalid',
    email: 'omar@four.com',
    password: 'password123',
    role: 'instructor',
    created_at: '2023-12-05',
    updated_at: '2023-12-05'
  },
  {
    id: 8,
    name: 'Reception Desk',
    email: 'reception@four.com',
    password: 'password123',
    role: 'reception',
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: 9,
    name: 'Main Admin',
    email: 'admin@four.com',
    password: 'adminpassword',
    role: 'admin',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 10,
    name: 'Super System Admin',
    email: 'super@four.com',
    password: 'superpassword',
    role: 'super_admin',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// ── LESSONS ─────────────────────────────────────────────
export const mockLessons: LessonRecord[] = [
  { id: 1, course_id: 1, title: 'Introduction to HTML', content: 'HTML content...', order: 1 },
  { id: 2, course_id: 1, title: 'Advanced CSS & Flexbox', content: 'CSS content...', order: 2 },
  { id: 3, course_id: 1, title: 'JavaScript Fundamentals', content: 'JS content...', order: 3 },
  { id: 4, course_id: 1, title: 'React Basics', content: 'React content...', order: 4 },
  { id: 5, course_id: 2, title: 'Python for Data Science', content: 'Python content...', order: 1 },
  { id: 6, course_id: 2, title: 'NumPy & Pandas', content: 'Data content...', order: 2 },
  { id: 7, course_id: 2, title: 'Machine Learning Intro', content: 'ML content...', order: 3 },
  { id: 8, course_id: 3, title: 'Photoshop Essentials', content: 'PS content...', order: 1 },
  { id: 9, course_id: 3, title: 'Illustrator Tools', content: 'AI content...', order: 2 },
  { id: 10, course_id: 4, title: 'SEO Fundamentals', content: 'SEO content...', order: 1 },
];

// ── ENROLLMENTS ─────────────────────────────────────────
export const mockEnrollments: EnrollmentRecord[] = [
  { id: 1, student_id: 1, course_id: 1, enrolled_at: '2024-01-05', progress: 75 },
  { id: 2, student_id: 1, course_id: 2, enrolled_at: '2024-01-06', progress: 30 },
  { id: 3, student_id: 2, course_id: 1, enrolled_at: '2024-01-07', progress: 100 },
  { id: 4, student_id: 3, course_id: 3, enrolled_at: '2024-01-08', progress: 50 },
  { id: 5, student_id: 4, course_id: 1, enrolled_at: '2024-01-09', progress: 10 }
];

// ── COURSES ─────────────────────────────────────────────
export const mockCourses: CourseRecord[] = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Learn to build modern web applications from scratch using HTML, CSS, JavaScript, and React. This comprehensive course covers frontend and backend development.',
    instructor_id: 5,
    instructor: null,
    price: 199,
    duration: '40 Hours',
    lessons: [],
    enrollments: []
  },
  {
    id: 2,
    title: 'Data Science & AI',
    description: 'Master data analysis and machine learning with Python. Learn NumPy, Pandas, Scikit-Learn, and TensorFlow to build powerful AI solutions.',
    instructor_id: 5,
    instructor: null,
    price: 249,
    duration: '60 Hours',
    lessons: [],
    enrollments: []
  },
  {
    id: 3,
    title: 'Graphic Design Masterclass',
    description: 'Learn Photoshop, Illustrator, and Figma from scratch. Build professional design skills to create stunning visuals for brands and products.',
    instructor_id: 6,
    instructor: null,
    price: 149,
    duration: '30 Hours',
    lessons: [],
    enrollments: []
  },
  {
    id: 4,
    title: 'Digital Marketing 101',
    description: 'Master SEO, SEM, and Social Media Marketing. Learn to grow brands online, run ad campaigns, and analyze data-driven results.',
    instructor_id: 6,
    instructor: null,
    price: 99,
    duration: '20 Hours',
    lessons: [],
    enrollments: []
  }
];

// Link lessons, enrollments, and instructor references
mockCourses.forEach(course => {
  course.instructor = mockUsers.find(u => u.id === course.instructor_id) || null;
  course.lessons = mockLessons.filter(l => l.course_id === course.id);
  course.enrollments = mockEnrollments.filter(e => e.course_id === course.id);
});

// ── ASSIGNMENTS ─────────────────────────────────────────
export const mockAssignments: AssignmentRecord[] = [
  { id: 1, course_id: 1, title: 'Build a Personal Portfolio', description: 'Create a fully responsive portfolio website using HTML, CSS, and JavaScript showcasing your work.', due_date: '2024-02-01' },
  { id: 2, course_id: 1, title: 'JavaScript Calculator', description: 'Build a functional calculator app using vanilla JavaScript with keyboard support.', due_date: '2024-02-15' },
  { id: 3, course_id: 2, title: 'Data Cleaning Project', description: 'Take a messy real-world dataset and perform data cleaning, transformation, and analysis using Pandas.', due_date: '2024-02-10' }
];

// ── SUBMISSIONS ─────────────────────────────────────────
export const mockSubmissions: SubmissionRecord[] = [
  { id: 1, assignment_id: 1, student_id: 1, content: 'Portfolio link: https://johndev.com', submitted_at: '2024-01-25', grade: 95 },
  { id: 2, assignment_id: 1, student_id: 2, content: 'Portfolio link: https://alice.dev', submitted_at: '2024-01-20', grade: 100 }
];

// ── PAYMENTS ────────────────────────────────────────────
export const mockPayments: PaymentRecord[] = [
  { id: 1, student_id: 1, course_id: 1, amount: 199, status: 'completed', created_at: '2024-01-05' },
  { id: 2, student_id: 1, course_id: 2, amount: 249, status: 'completed', created_at: '2024-01-06' },
  { id: 3, student_id: 2, course_id: 1, amount: 199, status: 'completed', created_at: '2024-01-07' },
  { id: 4, student_id: 3, course_id: 3, amount: 149, status: 'completed', created_at: '2024-01-08' },
  { id: 5, student_id: 4, course_id: 1, amount: 199, status: 'pending', created_at: '2024-01-09' },
  { id: 6, student_id: 1, course_id: 3, amount: 149, status: 'completed', created_at: '2024-04-18' },
  { id: 7, student_id: 2, course_id: 2, amount: 249, status: 'completed', created_at: '2024-04-19' },
  { id: 8, student_id: 3, course_id: 1, amount: 199, status: 'pending', created_at: '2024-04-20' }
];

// ── HELPER FUNCTIONS ────────────────────────────────────
export const getStudentData = (userId: number) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  const enrollments = mockEnrollments.filter(e => e.student_id === userId).map(e => ({
    ...e,
    course: mockCourses.find(c => c.id === e.course_id)
  }));
  return { ...user, enrollments };
};

export const getInstructorData = (userId: number) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  const courses = mockCourses.filter(c => c.instructor_id === userId);
  return { ...user, courses };
};
