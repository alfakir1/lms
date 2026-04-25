import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, DollarSign, UserCheck, CreditCard, Activity } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorMessage, LoadingSpinner } from '../../components/ui/Feedback';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard data..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage 
            title="Unable to load dashboard" 
            message="Check your permissions or internet connection." 
            onRetry={() => refetch()} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview and management.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_users?.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Total Courses</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_courses || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-secondary-50 rounded-xl text-secondary-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">${(stats.total_revenue || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Active Students</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.active_students?.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/admin/payments" className="flex items-center p-4 border border-slate-200 rounded-xl hover:border-primary-200 hover:bg-slate-50 transition group">
                    <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <span className="block font-bold text-slate-900">Review Payments</span>
                      <span className="text-sm text-slate-500">Manage pending approvals</span>
                    </div>
                  </Link>
                  <Link to="/courses" className="flex items-center p-4 border border-slate-200 rounded-xl hover:border-primary-200 hover:bg-slate-50 transition group">
                    <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <span className="block font-bold text-slate-900">View Courses</span>
                      <span className="text-sm text-slate-500">Browse platform catalog</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-600" />
                  Recent Activity
                </h2>
                
                {(!stats.recent_activities || stats.recent_activities.length === 0) ? (
                  <p className="text-slate-500 text-sm text-center py-8">No recent activities found.</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recent_activities.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm mt-1">
                          <Users className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium">{activity.message}</p>
                          <p className="text-slate-500 text-sm mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-slate-900 mb-4">Pending Attention</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="font-bold text-amber-900">{stats.pending_enrollments || 0} Enrollments</p>
                    <p className="text-sm text-amber-800 mt-1">Payments awaiting your review.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
