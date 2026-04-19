import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Shield, Settings, BarChart3, UserCheck, CreditCard } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalUsers: 2450,
    totalCourses: 89,
    totalRevenue: 45680,
    activeUsers: 1890,
    pendingPayments: 12,
    reportedIssues: 3
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: john.doe@example.com',
      time: '2 minutes ago',
      icon: Users
    },
    {
      id: 2,
      type: 'course_created',
      message: 'New course created: Advanced React Patterns',
      time: '15 minutes ago',
      icon: BookOpen
    },
    {
      id: 3,
      type: 'payment',
      message: 'Payment received: $299 from sarah@example.com',
      time: '1 hour ago',
      icon: DollarSign
    },
    {
      id: 4,
      type: 'report',
      message: 'Content report submitted for course: Python Basics',
      time: '2 hours ago',
      icon: Shield
    }
  ];

  const systemHealth = {
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    storageUsage: 68,
    uptime: '99.9%'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your LMS platform and monitor system performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-text">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-secondary rounded-lg">
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
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-text">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-text">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium text-text">Manage Users</span>
                </Link>
                <Link
                  to="/admin/courses"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-secondary mb-2" />
                  <span className="text-sm font-medium text-text">Manage Courses</span>
                </Link>
                <Link
                  to="/admin/payments"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="h-8 w-8 text-accent mb-2" />
                  <span className="text-sm font-medium text-text">Payments</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-text">Reports</span>
                </Link>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Settings className="h-8 w-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-text">Settings</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Shield className="h-8 w-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-text">Security</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-text text-sm">{activity.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">System Health</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">●</div>
                  <p className="text-sm font-medium text-text">Server</p>
                  <p className="text-xs text-gray-600">{systemHealth.serverStatus}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">●</div>
                  <p className="text-sm font-medium text-text">Database</p>
                  <p className="text-xs text-gray-600">{systemHealth.databaseStatus}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-text mb-1">{systemHealth.storageUsage}%</div>
                  <p className="text-sm font-medium text-text">Storage</p>
                  <p className="text-xs text-gray-600">Used</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{systemHealth.uptime}</div>
                  <p className="text-sm font-medium text-text">Uptime</p>
                  <p className="text-xs text-gray-600">This month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Alerts</h2>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-900">{stats.pendingPayments} Pending Payments</p>
                      <p className="text-xs text-yellow-700">Require attention</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-red-900">{stats.reportedIssues} Content Reports</p>
                      <p className="text-xs text-red-700">Need review</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Revenue Trend</h2>
              <div className="h-32 flex items-end justify-between space-x-1">
                {[65, 45, 78, 52, 89, 67, 91].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-accent rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">Platform Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text">Courses Published</span>
                  <span className="font-semibold text-primary">{stats.totalCourses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Active Instructors</span>
                  <span className="font-semibold text-secondary">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Student Enrollments</span>
                  <span className="font-semibold text-accent">1,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Avg. Session Time</span>
                  <span className="font-semibold text-text">42 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;