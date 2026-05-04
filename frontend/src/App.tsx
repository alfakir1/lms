import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const Login = lazy(() => import('./pages/Login.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.tsx'));
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard.tsx'));
const AIAssessmentGenerator = lazy(() => import('./pages/instructor/AIAssessmentGenerator.tsx'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.tsx'));
const ReceptionDashboard = lazy(() => import('./pages/reception/ReceptionDashboard.tsx'));
const StudentRegistration = lazy(() => import('./pages/reception/StudentRegistration.tsx'));
const Users = lazy(() => import('./pages/admin/Users.tsx'));
const CoursesList = lazy(() => import('./pages/CoursesList.tsx'));
const CourseDetails = lazy(() => import('./pages/CourseDetails.tsx'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer.tsx'));
const Assignments = lazy(() => import('./pages/Assignments.tsx'));
const SubmissionPage = lazy(() => import('./pages/SubmissionPage.tsx'));
const GradesPage = lazy(() => import('./pages/GradesPage.tsx'));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage.tsx'));
const AttendancePage = lazy(() => import('./pages/Attendance.tsx'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage.tsx'));
const EnrollmentsPage = lazy(() => import('./pages/EnrollmentsPage.tsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.tsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.tsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.tsx'));
const Reports = lazy(() => import('./pages/admin/Reports.tsx'));
const AssessmentsPage = lazy(() => import('./pages/AssessmentsPage.tsx'));
const QuizAttempt = lazy(() => import('./pages/QuizAttempt.tsx'));
const AssessmentSubmissionsPage = lazy(() => import('./pages/AssessmentSubmissionsPage.tsx'));
const HomePage = lazy(() => import('./pages/public/HomePage.tsx'));


// RBAC shorthand helpers
const ADMIN        = ['admin'] as const;
const ADMIN_REC    = ['admin', 'reception'] as const;
const INST_STD     = ['instructor', 'student'] as const;
const ADMIN_REC_STD = ['admin', 'reception', 'student'] as const;
const ALL_ROLES    = ['admin', 'instructor', 'student', 'reception'] as const;
const REC_ONLY     = ['reception'] as const;
const STD_ONLY     = ['student'] as const;
const INST_ONLY    = ['instructor'] as const;

const guard = (roles: readonly string[], el: React.ReactNode) => (
  <ProtectedRoute allowedRoles={roles as any}>{el}</ProtectedRoute>
);

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-50"><LoadingSpinner size="lg" /></div>}>
      <Routes>
        {/* ─── Public ─── */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />

        {/* ─── Protected — dashboard layout ─── */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

          {/* ── Role-specific dashboards ── */}
          <Route path="/admin/dashboard"      element={guard(ADMIN,     <AdminDashboard />)} />
          <Route path="/instructor/dashboard" element={guard(INST_ONLY, <InstructorDashboard />)} />
          <Route path="/student/dashboard"    element={guard(STD_ONLY,  <StudentDashboard />)} />
          <Route path="/reception/dashboard"  element={guard(REC_ONLY,  <ReceptionDashboard />)} />

          {/* ── Courses — all roles can VIEW, only admin/instructor can manage (enforced in UI & backend) ── */}
          <Route path="/courses"           element={guard(ALL_ROLES,  <CoursesList />)} />
          <Route path="/courses/:id"       element={guard(ALL_ROLES,  <CourseDetails />)} />
          <Route path="/enrollments"       element={guard(['admin', 'instructor', 'reception'] as any, <EnrollmentsPage />)} />
          <Route path="/courses/:id/play"  element={guard(INST_STD,   <CoursePlayer />)} />


          {/* ── Assignments — instructor creates, student submits ── */}
          <Route path="/assignments"            element={guard(INST_STD,  <Assignments />)} />
          <Route path="/assignments/:id/submit" element={guard(STD_ONLY,  <SubmissionPage />)} />

          {/* ── Assessments (Quizzes) ── */}
          <Route path="/assessments" element={guard(INST_STD, <AssessmentsPage />)} />
          <Route path="/assessments/:id/attempt" element={guard(STD_ONLY, <QuizAttempt />)} />
          <Route path="/assessments/:id/submissions" element={guard(INST_ONLY, <AssessmentSubmissionsPage />)} />

          {/* ── AI Tools — instructor only ── */}
          <Route path="/ai/generate-assessment" element={guard(INST_ONLY, <AIAssessmentGenerator />)} />

          {/* ── Grades — instructor & student only ── */}
          <Route path="/grades" element={guard(INST_STD, <GradesPage />)} />

          {/* ── Payments — admin, reception, student (student sees own payments only) ── */}
          <Route path="/payments" element={guard(ADMIN_REC_STD, <PaymentsPage />)} />

          {/* ── Attendance — instructor manages, reception views ── */}
          <Route path="/attendance" element={guard(['instructor', 'reception'] as any, <AttendancePage />)} />

          {/* ── User Management — admin full, reception (students only, enforced in backend) ── */}
          <Route path="/users" element={guard(ADMIN_REC, <Users />)} />
          <Route path="/reports" element={guard(ADMIN, <Reports />)} />

          {/* ── Reception-specific: full student registration + receipt workflow ── */}
          <Route path="/register-student" element={guard(ADMIN_REC, <StudentRegistration />)} />
          <Route path="/certificates" element={guard(['admin', 'instructor', 'reception'] as any, <CertificatesPage />)} />
          <Route path="/profile" element={guard(ALL_ROLES, <ProfilePage />)} />
          <Route path="/settings" element={guard(ALL_ROLES, <SettingsPage />)} />
          <Route path="/chat" element={guard(ALL_ROLES, <ChatPage />)} />
        </Route>

        {/* ─── 404 ─── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );

}

export default App;
