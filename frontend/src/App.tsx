import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
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
import StudentPayments from './pages/student/StudentPayments';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import InstructorLectures from './pages/instructor/InstructorLectures';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import Payments from './pages/admin/Payments';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
            <ToastProvider>
              <Router>
                <Routes>
                  {/* Public Routes (with Header + Footer) */}
                  <Route path="/" element={<><Header /><Home /><Footer /></>} />
                  <Route path="/courses" element={<><Header /><Courses /><Footer /></>} />
                  <Route path="/courses/:id" element={<><Header /><CourseDetails /><Footer /></>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Student Routes */}
                  <Route path="/student/dashboard" element={<DashboardRoute roles={['student']} element={<StudentDashboard />} />} />
                  <Route path="/student/courses" element={<DashboardRoute roles={['student']} element={<MyCourses />} />} />
                  <Route path="/student/courses/:courseId/learn" element={<DashboardRoute roles={['student']} element={<CoursePlayer />} />} />
                  <Route path="/student/payments" element={<DashboardRoute roles={['student']} element={<StudentPayments />} />} />

                  {/* Instructor Routes */}
                  <Route path="/instructor/dashboard" element={<DashboardRoute roles={['instructor', 'admin', 'super_admin']} element={<InstructorDashboard />} />} />
                  <Route path="/instructor/courses" element={<DashboardRoute roles={['instructor', 'admin', 'super_admin']} element={<InstructorCourses />} />} />
                  <Route path="/instructor/lectures" element={<DashboardRoute roles={['instructor', 'admin', 'super_admin']} element={<InstructorLectures />} />} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<DashboardRoute roles={['admin', 'super_admin']} element={<AdminDashboard />} />} />
                  <Route path="/admin/users" element={<DashboardRoute roles={['admin', 'super_admin']} element={<AdminUsers />} />} />
                  <Route path="/admin/payments" element={<DashboardRoute roles={['admin', 'super_admin']} element={<Payments />} />} />

                  <Route path="*" element={<Navigate to="/courses" replace />} />
                </Routes>
              </Router>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
