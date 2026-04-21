import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { BookOpen, Clock, Award, Play, CheckCircle, Loader2 } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const response = await api.get('/enrollments/my');
      return response.data;
    }
  });

  const isLoading = enrollmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-text font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  // Derived stats
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter((e: any) => e.progress === 100).length || 0;

  const enrolledCourses = enrollments || [];

  const stats = {
    totalCourses,
    completedCourses,
    totalHours: 0, // Not yet tracked in backend
    certificates: 0 // Mock for now
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-gray-600">Continue your learning journey with Four Academy</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-text">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-text">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-secondary rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Hours</p>
                <p className="text-2xl font-bold text-text">{stats.totalHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-text">{stats.certificates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Continue Learning</h2>
                <Link
                  to="/student/courses"
                  className="text-secondary hover:text-primary text-sm font-medium"
                >
                  View all courses →
                </Link>
              </div>

              <div className="space-y-4">
                {enrolledCourses.length > 0 ? enrolledCourses.map((enrollment: any) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-text mb-1">{enrollment.course?.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">Progress: {enrollment.progress}%</p>

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                             Keep pushing forward!
                          </span>
                          <Link
                            to={`/student/courses/${enrollment.course?.id}/learn`}
                            className="flex items-center space-x-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Play className="h-4 w-4" />
                            <span>Continue</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                    <Link to="/courses" className="text-primary hover:underline mt-2 inline-block">Browse Courses</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Recent Assignments</h2>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-500 font-medium">Assignments feature is coming soon!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Recent Achievements</h2>
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
                <p className="text-slate-500 text-sm font-medium">Coming Soon</p>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <h3 className="text-xl font-bold mb-2">7 Day Streak!</h3>
                <p className="text-blue-100 mb-4">Keep it up! You're on fire!</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < 5 ? 'bg-accent' : 'bg-blue-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="block w-full bg-secondary text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/student/certificates"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Certificates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;