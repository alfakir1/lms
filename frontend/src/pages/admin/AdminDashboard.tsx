import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUsers, usePayments, useApprovePayment } from '../../hooks/useApiHooks';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t, dir } = useLang();
  
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: allPayments, isLoading: paymentsLoading } = usePayments();
  const approveMutation = useApprovePayment();

  if (statsLoading || usersLoading || paymentsLoading) return <LoadingSpinner />;

  const pendingPayments = allPayments?.filter((p: any) => p.status === 'pending') || [];
  const recentUsers = users?.slice(-5).reverse() || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {lang === 'ar' ? 'لوحة تحكم النظام' : 'System Administration'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            {lang === 'ar' ? `مرحباً ${user?.name}، لديك كامل الصلاحيات لإدارة المنصة.` : `Welcome ${user?.name}, you have full administrative privileges.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/users" className="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>{lang === 'ar' ? 'إضافة مستخدم' : 'Add User'}</span>
          </Link>
          <button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            <span>{lang === 'ar' ? 'تصدير البيانات' : 'Export Data'}</span>
          </button>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Revenue - Large Card */}
        <div className="md:col-span-2 bg-slate-900 dark:bg-primary-container text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-64 shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-80 uppercase text-[10px] font-black tracking-widest">
              <span className="material-symbols-outlined text-sm">analytics</span>
              {lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </div>
            <h2 className="text-5xl font-extrabold mb-2">${statsData?.total_revenue || 0}</h2>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +24% {lang === 'ar' ? 'منذ الشهر الماضي' : 'from last month'}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
             <span className="material-symbols-outlined text-[140px]">monitoring</span>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined fill-icon text-3xl">group</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{statsData?.total_users || 0}</p>
        </div>

        {/* Active Courses */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined fill-icon text-3xl">book</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{lang === 'ar' ? 'الكورسات الفعالة' : 'Active Courses'}</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{statsData?.active_courses || 0}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{lang === 'ar' ? 'أحدث المستخدمين المنضمين' : 'Newest Joiners'}</h3>
            <Link to="/users" className="text-primary-container font-bold text-sm hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider text-center">{lang === 'ar' ? 'الدور' : 'Role'}</th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{lang === 'ar' ? 'التاريخ' : 'Joined'}</th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {recentUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold text-primary-container">
                          {u.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                        u.role === 'instructor' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                        'bg-slate-100 text-slate-600 dark:bg-white/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-slate-500 text-sm">
                      {new Date(u.created_at || Date.now()).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-primary-container hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8 h-fit">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{lang === 'ar' ? 'طلبات دفع معلقة' : 'Pending Requests'}</h3>
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              {pendingPayments.length}
            </span>
          </div>
          <div className="space-y-6">
            {pendingPayments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-3 opacity-20">payments</span>
                <p className="text-sm italic">{lang === 'ar' ? 'لا توجد طلبات بانتظار الاعتماد' : 'No pending requests'}</p>
              </div>
            ) : (
              pendingPayments.map((p: any) => (
                <div key={p.id} className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary-container/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-container transition-colors">{p.student?.user?.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 line-clamp-1">{p.course?.title}</p>
                    </div>
                    <span className="text-lg font-extrabold text-primary-container">${p.amount}</span>
                  </div>
                  <button
                    onClick={() => approveMutation.mutate(p.id)}
                    disabled={approveMutation.isPending}
                    className="w-full bg-white dark:bg-slate-800 text-primary-container border border-primary-container/20 py-2.5 rounded-xl text-xs font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {approveMutation.isPending ? '...' : (lang === 'ar' ? 'اعتماد الدفع' : 'Approve Payment')}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
