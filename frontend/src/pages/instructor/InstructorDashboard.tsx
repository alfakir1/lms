import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, DollarSign } from 'lucide-react';

const InstructorDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalCourses: 5,
    totalStudents: 1247,
    totalAssignments: 23,
    averageRating: 4.8,
    totalRevenue: 15420,
    pendingAssignments: 8,
    completedThisMonth: 45
  };

  const recentCourses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      students: 234,
      rating: 4.9,
      revenue: 4680,
      status: 'active'
    },
    {
      id: 2,
      title: 'React for Beginners',
      students: 189,
      rating: 4.7,
      revenue: 3780,
      status: 'active'
    },
    {
      id: 3,
      title: 'Python Programming',
      students: 156,
      rating: 4.8,
      revenue: 3120,
      status: 'draft'
    }
  ];

  const recentAssignments = [
    {
      id: 1,
      title: 'Build a Responsive Landing Page',
      course: 'Web Development Fundamentals',
      student: 'John Doe',
      submittedDate: '2024-01-18',
      status: 'pending'
    },
    {
      id: 2,
      title: 'React Component Exercise',
      course: 'React for Beginners',
      student: 'Jane Smith',
      submittedDate: '2024-01-17',
      status: 'graded'
    },
    {
      id: 3,
      title: 'Database Design Project',
      course: 'Python Programming',
      student: 'Mike Johnson',
      submittedDate: '2024-01-16',
      status: 'pending'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Grade Web Dev Assignments',
      course: 'Web Development Fundamentals',
      deadline: '2024-01-22',
      count: 15
    },
    {
      id: 2,
      title: 'Review React Projects',
      course: 'React for Beginners',
      deadline: '2024-01-25',
      count: 8
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your courses, students, and assignments</p>
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
              <div className="p-3 bg-secondary rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-text">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-text">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-text">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">My Courses</h2>
                <Link
                  to="/instructor/courses"
                  className="text-secondary hover:text-primary text-sm font-medium"
                >
                  Manage all courses →
                </Link>
              </div>

              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-primary">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-2" />
                        <span>{course.rating} rating</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                        <span>${course.revenue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Link
                        to={`/instructor/courses/${course.id}/lessons`}
                        className="text-secondary hover:text-primary text-sm"
                      >
                        Manage lessons →
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/students`}
                        className="text-secondary hover:text-primary text-sm"
                      >
                        View students →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Recent Submissions</h2>
                <Link
                  to="/instructor/assignments"
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
                      <p className="text-sm text-gray-500">Submitted by {assignment.student} on {assignment.submittedDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status}
                      </span>
                      <button className="text-secondary hover:text-primary text-sm">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/instructor/courses/new"
                  className="block w-full bg-secondary text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Course
                </Link>
                <Link
                  to="/instructor/assignments"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Grade Assignments
                </Link>
                <Link
                  to="/instructor/students"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Students
                </Link>
                <Link
                  to="/instructor/attendance"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Attendance Table
                </Link>
                <Link
                  to="/instructor/grades"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Grade Management Sheet
                </Link>
                <Link
                  to="/instructor/analytics"
                  className="block w-full border border-gray-300 text-text text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-900">{deadline.title}</h3>
                    <p className="text-sm text-red-700">{deadline.course}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-red-600">{deadline.count} submissions</span>
                      <span className="text-sm text-red-600">Due: {deadline.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">This Month</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text">Students Enrolled</span>
                  <span className="font-semibold text-green-600">+{stats.completedThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Assignments Graded</span>
                  <span className="font-semibold text-blue-600">{stats.totalAssignments - stats.pendingAssignments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Pending Reviews</span>
                  <span className="font-semibold text-yellow-600">{stats.pendingAssignments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Average Rating</span>
                  <span className="font-semibold text-accent">{stats.averageRating} ★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;