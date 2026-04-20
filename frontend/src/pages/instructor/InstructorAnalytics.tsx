import React, { useState } from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Activity } from 'lucide-react';

const InstructorAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analytics = {
    overview: {
      totalStudents: 245,
      totalCourses: 8,
      totalRevenue: 12500,
      averageRating: 4.8
    },
    coursePerformance: [
      {
        id: 1,
        title: 'Web Development Fundamentals',
        students: 89,
        completionRate: 78,
        averageGrade: 'A-',
        revenue: 4500,
        rating: 4.9
      },
      {
        id: 2,
        title: 'React for Beginners',
        students: 67,
        completionRate: 85,
        averageGrade: 'A',
        revenue: 3200,
        rating: 4.7
      },
      {
        id: 3,
        title: 'Python Programming',
        students: 45,
        completionRate: 72,
        averageGrade: 'B+',
        revenue: 2800,
        rating: 4.6
      },
      {
        id: 4,
        title: 'Data Science with Python',
        students: 34,
        completionRate: 65,
        averageGrade: 'B',
        revenue: 2000,
        rating: 4.5
      }
    ],
    enrollmentTrends: [
      { month: 'Jan', enrollments: 45 },
      { month: 'Feb', enrollments: 52 },
      { month: 'Mar', enrollments: 48 },
      { month: 'Apr', enrollments: 61 },
      { month: 'May', enrollments: 55 },
      { month: 'Jun', enrollments: 67 }
    ],
    revenueTrends: [
      { month: 'Jan', revenue: 1800 },
      { month: 'Feb', revenue: 2100 },
      { month: 'Mar', revenue: 1950 },
      { month: 'Apr', revenue: 2450 },
      { month: 'May', revenue: 2200 },
      { month: 'Jun', revenue: 2800 }
    ]
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-yellow-600';
    if (grade.startsWith('C')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your teaching performance and course metrics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-primary">{analytics.overview.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-secondary">{analytics.overview.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+2</span>
              <span className="text-gray-600 ml-1">new this month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-accent">${analytics.overview.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+18%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-text">{analytics.overview.averageRating}</p>
              </div>
              <Activity className="h-8 w-8 text-text" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+0.2</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enrollment Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Enrollment Trends</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.enrollmentTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${(data.enrollments / 70) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  <span className="text-xs font-semibold text-text">{data.enrollments}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Revenue Trends</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.revenueTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent rounded-t"
                    style={{ height: `${(data.revenue / 3000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  <span className="text-xs font-semibold text-text">${data.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-6">Course Performance</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-text">Course</th>
                  <th className="text-center py-3 px-4 font-semibold text-text">Students</th>
                  <th className="text-center py-3 px-4 font-semibold text-text">Completion</th>
                  <th className="text-center py-3 px-4 font-semibold text-text">Avg Grade</th>
                  <th className="text-center py-3 px-4 font-semibold text-text">Revenue</th>
                  <th className="text-center py-3 px-4 font-semibold text-text">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics.coursePerformance.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-primary">{course.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-text">{course.students}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{course.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${getGradeColor(course.averageGrade)}`}>
                        {course.averageGrade}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-accent">${course.revenue}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-semibold text-text mr-1">{course.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-text mb-4">Top Performing Course</h4>
            <p className="text-primary font-medium mb-2">React for Beginners</p>
            <p className="text-sm text-gray-600">Highest completion rate at 85%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-text mb-4">Most Popular Course</h4>
            <p className="text-primary font-medium mb-2">Web Development Fundamentals</p>
            <p className="text-sm text-gray-600">89 students enrolled</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-text mb-4">Revenue Leader</h4>
            <p className="text-primary font-medium mb-2">Web Development Fundamentals</p>
            <p className="text-sm text-gray-600">$4,500 generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;