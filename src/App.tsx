import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

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

// Admin Pages
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import RegisterStudent from './pages/reception/RegisterStudent';
import StudentsManagement from './pages/reception/StudentsManagement';
import CoursesView from './pages/reception/CoursesView';
import PaymentsView from './pages/reception/PaymentsView';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';

// Styles
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-text dark:bg-slate-950 dark:text-white">
                <Header />
                <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses"
                  element={
                    <ProtectedRoute roles={['student']}>
                      <MyCourses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/:courseId/learn"
                  element={
                    <ProtectedRoute roles={['student']}>
                      <CoursePlayer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/assignments"
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentAssignments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/certificates"
                  element={
                    <ProtectedRoute roles={['student']}>
                      <Certificates />
                    </ProtectedRoute>
                  }
                />

                {/* Instructor Routes */}
                <Route
                  path="/instructor/dashboard"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <InstructorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <ManageCourses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:courseId/lessons"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <ManageLessons />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/assignments"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <InstructorAssignments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/students"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <InstructorStudents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/analytics"
                  element={
                    <ProtectedRoute roles={['instructor']}>
                      <InstructorAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Add Reception routes */}
                <Route
                  path="/reception/dashboard"
                  element={
                    <ProtectedRoute roles={['reception']}>
                      <ReceptionDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reception/register"
                  element={
                    <ProtectedRoute roles={['reception']}>
                      <RegisterStudent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reception/students"
                  element={
                    <ProtectedRoute roles={['reception']}>
                      <StudentsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reception/courses"
                  element={
                    <ProtectedRoute roles={['reception']}>
                      <CoursesView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reception/payments"
                  element={
                    <ProtectedRoute roles={['reception']}>
                      <PaymentsView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <UsersManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/courses"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <CoursesManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
