import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Play, CheckCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const enrolledCourses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 75,
      nextLesson: 'CSS Flexbox and Grid',
      totalLessons: 24,
      completedLessons: 18,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'React for Beginners',
      instructor: 'Mike Chen',
      progress: 45,
      nextLesson: 'Components and Props',
      totalLessons: 32,
      completedLessons: 14,
      image: '/api/placeholder/300/200'
    }
  ];

  const recentAssignments = [
    {
      id: 1,
      title: 'Build a Responsive Landing Page',
      course: 'Web Development Fundamentals',
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      title: 'React Component Exercise',
      course: 'React for Beginners',
      dueDate: '2024-01-18',
      status: 'submitted'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', icon: '🏆', date: '2024-01-10' },
    { id: 2, title: 'Week Streak', icon: '🔥', date: '2024-01-15' },
    { id: 3, title: 'Assignment Master', icon: '📝', date: '2024-01-12' }
  ];

  const stats = {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 48,
    certificates: 2
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Welcome back, John!</h1>
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
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-text mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {course.completedLessons} of {course.totalLessons} lessons completed
                          </span>
                          <Link
                            to={`/student/courses/${course.id}/learn`}
                            className="flex items-center space-x-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Play className="h-4 w-4" />
                            <span>Continue</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Recent Assignments</h2>
                <Link
                  to="/student/assignments"
                  className="text-secondary hover:text-primary text-sm font-medium"
                >
                  View all assignments →
                </Link>
              </div>

              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-text">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                      <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === 'submitted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-text">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/student/certificates"
                className="block mt-4 text-center text-secondary hover:text-primary text-sm font-medium"
              >
                View all achievements →
              </Link>
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