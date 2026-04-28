import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import NotFound from './pages/NotFound.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import InstructorDashboard from './pages/instructor/InstructorDashboard.tsx';
import StudentDashboard from './pages/student/StudentDashboard.tsx';
import ReceptionDashboard from './pages/reception/ReceptionDashboard.tsx';
import StudentRegistration from './pages/reception/StudentRegistration.tsx';
import Users from './pages/admin/Users.tsx';
import CoursesList from './pages/CoursesList.tsx';
import CourseDetails from './pages/CourseDetails.tsx';
import CoursePlayer from './pages/CoursePlayer.tsx';
import Assignments from './pages/Assignments.tsx';
import SubmissionPage from './pages/SubmissionPage.tsx';
import GradesPage from './pages/GradesPage.tsx';
import PaymentsPage from './pages/PaymentsPage.tsx';
import AttendancePage from './pages/Attendance.tsx';
import CertificatesPage from './pages/CertificatesPage.tsx';
import EnrollmentsPage from './pages/EnrollmentsPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';


// No RootRedirect used anymore

import HomePage from './pages/public/HomePage.tsx';

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

        {/* ── Grades — instructor & student only ── */}
        <Route path="/grades" element={guard(INST_STD, <GradesPage />)} />

        {/* ── Payments — admin, reception, student (student sees own payments only) ── */}
        <Route path="/payments" element={guard(ADMIN_REC_STD, <PaymentsPage />)} />

        {/* ── Attendance — instructor manages, reception views ── */}
        <Route path="/attendance" element={guard(['instructor', 'reception'] as any, <AttendancePage />)} />

        {/* ── User Management — admin full, reception (students only, enforced in backend) ── */}
        <Route path="/users" element={guard(ADMIN_REC, <Users />)} />

        {/* ── Reception-specific: full student registration + receipt workflow ── */}
        <Route path="/register-student" element={guard(ADMIN_REC, <StudentRegistration />)} />
        <Route path="/certificates" element={guard(['admin', 'instructor', 'reception'] as any, <CertificatesPage />)} />
        <Route path="/profile" element={guard(ALL_ROLES, <ProfilePage />)} />
      </Route>

      {/* ─── 404 ─── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
