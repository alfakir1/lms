import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Activity, Settings, Shield, ChevronRight, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockUsers, mockCourses, mockPayments } from '../../utils/mockData';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = {
    totalUsers: mockUsers.length,
    totalCourses: mockCourses.length,
    totalRevenue: mockPayments.reduce((acc, curr) => acc + curr.amount, 0),
    activeUsers: 142
  };

  const recentUsers = mockUsers.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse">
          <div className="flex items-center gap-4 rtl:flex-row-reverse">
            <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-2xl text-red-600 shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div className="rtl:text-right">
              <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">{t('admin.dashboardTitle', 'Admin Dashboard')}</h1>
              <p className="text-neutral-500 dark:text-neutral-400">{t('admin.subtitle', 'Platform management and system overview')}</p>
            </div>
          </div>
          <div className="flex gap-4 rtl:flex-row-reverse">
            <button className="bg-neutral-100 dark:bg-slate-800 dark:text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all rtl:flex-row-reverse">
              <Settings className="w-5 h-5" />
              {t('admin.settings', 'Settings')}
            </button>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 rtl:flex-row-reverse">
              <UserPlus className="w-5 h-5" />
              {t('admin.addUser', 'Add User')}
            </button>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: t('admin.totalUsers', 'Total Users'), value: stats.totalUsers, icon: <Users />, color: 'bg-blue-500' },
            { label: t('admin.totalCourses', 'Total Courses'), value: stats.totalCourses, icon: <BookOpen />, color: 'bg-purple-500' },
            { label: t('admin.totalRevenue', 'Total Revenue'), value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'bg-green-500' },
            { label: t('admin.activeUsers', 'Active Users'), value: stats.activeUsers, icon: <Activity />, color: 'bg-orange-500' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 rtl:text-right"
            >
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rtl:ml-0 rtl:mr-auto`}>
                {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
              </div>
              <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-neutral-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Users */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-neutral-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-neutral-50 dark:border-slate-800 flex items-center justify-between rtl:flex-row-reverse">
              <h2 className="text-xl font-bold dark:text-white">{t('admin.recentActivities', 'Recent Activities')}</h2>
              <Link to="/admin/users" className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1 rtl:flex-row-reverse">
                {t('admin.manageUsers', 'Manage Users')} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-50 dark:divide-slate-800">
              {recentUsers.map(user => (
                <div
                  key={user.id}
                  className="p-6 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-all rtl:flex-row-reverse"
                >
                  <div className="flex items-center gap-4 rtl:flex-row-reverse">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-slate-800 flex items-center justify-center font-bold text-neutral-400 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="rtl:text-right">
                      <p className="font-bold dark:text-white">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 rtl:flex-row-reverse">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-600'
                          : user.role === 'instructor'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {t(`common.${user.role}`, user.role)}
                    </span>
                    <button className="p-2 text-neutral-400 hover:text-primary-600 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health / Financial */}
          <div className="space-y-10">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 rtl:text-right">
              <h2 className="text-xl font-bold mb-6 dark:text-white">{t('admin.systemHealth', 'System Health')}</h2>
              <div className="space-y-4">
                {[
                  { label: t('admin.server', 'Server'), value: '99.9%', color: 'bg-green-500' },
                  { label: t('admin.database', 'Database'), value: '45%', color: 'bg-blue-500' },
                  { label: t('admin.storage', 'Storage'), value: '12%', color: 'bg-green-500' }
                ].map((log, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider rtl:flex-row-reverse">
                      <span className="text-neutral-500">{log.label}</span>
                      <span className="dark:text-white">{log.value}</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`${log.color} h-full rounded-full`} style={{ width: log.value }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/reports"
                className="block w-full mt-8 py-4 bg-primary-600 text-white rounded-2xl text-center text-sm font-bold shadow-soft hover:shadow-glow transition-all"
              >
                {t('admin.generateReport', 'Generate Report')}
              </Link>
            </div>

            <div className="bg-neutral-900 dark:bg-primary-900 p-8 rounded-3xl text-white shadow-xl rtl:text-right">
              <h3 className="text-lg font-bold mb-2">{t('admin.financialOverview', 'Financial Overview')}</h3>
              <p className="text-3xl font-black mb-2">$14,250.00</p>
              <p className="text-xs text-neutral-400 dark:text-primary-200 mb-6">{t('common.quarter', 'Q1 2024')}</p>
              <Link
                to="/admin/payments"
                className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-sm rtl:flex-row-reverse"
              >
                {t('admin.viewAllPayments', 'View All Payments')}
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;