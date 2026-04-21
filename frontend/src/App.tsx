import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CoursePlayer from './pages/student/CoursePlayer';
import StudentAssignments from './pages/student/StudentAssignments';
import Certificates from './pages/student/Certificates';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ManageCourses from './pages/instructor/ManageCourses';
import ManageLessons from './pages/instructor/ManageLessons';
import InstructorAssignments from './pages/instructor/InstructorAssignments';
import InstructorStudents from './pages/instructor/InstructorStudents';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';
import Attendance from './pages/instructor/Attendance';
import GradeSheet from './pages/instructor/GradeSheet';

// Reception Pages
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import RegisterStudent from './pages/reception/RegisterStudent';
import StudentsManagement from './pages/reception/StudentsManagement';
import CoursesView from './pages/reception/CoursesView';
import PaymentsView from './pages/reception/PaymentsView';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';

// Styles
import './App.css';

const queryClient = new QueryClient();

// Helper: wrap a component in DashboardLayout + ProtectedRoute
const DashboardRoute = ({
  element,
  roles,
}: {
  element: React.ReactNode;
  roles: string[];
}) => (
  <ProtectedRoute roles={roles}>
    <DashboardLayout>{element}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* ── Public Routes (with Header + Footer) ── */}
                <Route path="/" element={<><Header /><Home /><Footer /></>} />
                <Route path="/courses" element={<><Header /><Courses /><Footer /></>} />
                <Route path="/courses/:id" element={<><Header /><CourseDetails /><Footer /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ── Student Routes ── */}
                <Route path="/student/dashboard"           element={<DashboardRoute roles={['student']} element={<StudentDashboard />} />} />
                <Route path="/student/courses"             element={<DashboardRoute roles={['student']} element={<MyCourses />} />} />
                <Route path="/student/courses/:courseId/learn" element={<DashboardRoute roles={['student']} element={<CoursePlayer />} />} />
                <Route path="/student/assignments"         element={<DashboardRoute roles={['student']} element={<StudentAssignments />} />} />
                <Route path="/student/certificates"        element={<DashboardRoute roles={['student']} element={<Certificates />} />} />

                {/* ── Instructor Routes ── */}
                <Route path="/instructor/dashboard"  element={<DashboardRoute roles={['instructor']} element={<InstructorDashboard />} />} />
                <Route path="/instructor/courses"    element={<DashboardRoute roles={['instructor']} element={<ManageCourses />} />} />
                <Route path="/instructor/courses/:courseId/lessons" element={<DashboardRoute roles={['instructor']} element={<ManageLessons />} />} />
                <Route path="/instructor/assignments" element={<DashboardRoute roles={['instructor']} element={<InstructorAssignments />} />} />
                <Route path="/instructor/students"   element={<DashboardRoute roles={['instructor']} element={<InstructorStudents />} />} />
                <Route path="/instructor/analytics"  element={<DashboardRoute roles={['instructor']} element={<InstructorAnalytics />} />} />
                <Route path="/instructor/attendance" element={<DashboardRoute roles={['instructor']} element={<Attendance />} />} />
                <Route path="/instructor/grades"     element={<DashboardRoute roles={['instructor']} element={<GradeSheet />} />} />

                {/* ── Reception Routes ── */}
                <Route path="/reception/dashboard" element={<DashboardRoute roles={['reception']} element={<ReceptionDashboard />} />} />
                <Route path="/reception/register"  element={<DashboardRoute roles={['reception']} element={<RegisterStudent />} />} />
                <Route path="/reception/students"  element={<DashboardRoute roles={['reception']} element={<StudentsManagement />} />} />
                <Route path="/reception/courses"   element={<DashboardRoute roles={['reception']} element={<CoursesView />} />} />
                <Route path="/reception/payments"  element={<DashboardRoute roles={['reception']} element={<PaymentsView />} />} />

                {/* ── Admin Routes ── */}
                <Route path="/admin/dashboard" element={<DashboardRoute roles={['admin', 'super_admin']} element={<AdminDashboard />} />} />
                <Route path="/admin/users"     element={<DashboardRoute roles={['admin', 'super_admin']} element={<UsersManagement />} />} />
                <Route path="/admin/courses"   element={<DashboardRoute roles={['admin', 'super_admin']} element={<CoursesManagement />} />} />
                <Route path="/admin/payments"  element={<DashboardRoute roles={['admin', 'super_admin']} element={<Payments />} />} />
                <Route path="/admin/reports"   element={<DashboardRoute roles={['admin', 'super_admin']} element={<Reports />} />} />
              </Routes>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
