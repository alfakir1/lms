import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, DollarSign, UserCheck, CreditCard, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard: React.FC = () => {
  // Fetch real data from Backend
  const { data: statsResponse, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-text font-medium">Loading Dashboard Statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold">
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  const stats = statsResponse;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 p-8 glass rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary mb-2 relative z-10">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 relative z-10 text-lg">Manage your LMS platform and monitor system performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-black text-slate-800">{stats.total_users.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Courses</p>
                <p className="text-2xl font-black text-slate-800">{stats.total_courses}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-slate-800">${stats.total_revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Students</p>
                <p className="text-2xl font-black text-slate-800">{stats.active_students.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Link to="/admin/users" className="glass flex flex-col items-center p-6 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-bold text-text">Manage Users</span>
                </Link>
                <Link to="/admin/courses" className="glass flex flex-col items-center p-6 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-text">Manage Courses</span>
                </Link>
                <Link to="/admin/payments" className="glass flex flex-col items-center p-6 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-text">Payments</span>
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                Recent Activities
              </h2>
              <div className="space-y-4">
                {stats.recent_activities.length > 0 ? stats.recent_activities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-text text-sm font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm text-center py-4">No recent activities found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text mb-6">System Status</h2>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">{stats.pending_enrollments} Pending Enrollments</p>
                    <p className="text-xs text-amber-700">Require approval attention</p>
                  </div>
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