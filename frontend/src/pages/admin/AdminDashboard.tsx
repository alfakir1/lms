import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUsers, usePayments, useApprovePayment } from '../../hooks/useApiHooks';
import { Users, BookOpen, CreditCard, TrendingUp, UserPlus, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: allPayments, isLoading: paymentsLoading } = usePayments();
  const approveMutation = useApprovePayment();

  if (statsLoading || usersLoading || paymentsLoading) return <LoadingSpinner />;

  const stats = [
    { name: 'إجمالي المستخدمين', value: statsData?.total_users || 0, icon: Users, color: 'bg-indigo-500', trend: 'نشط' },
    { name: 'الكورسات الفعالة', value: statsData?.active_courses || 0, icon: BookOpen, color: 'bg-emerald-500', trend: 'مستمر' },
    { name: 'إجمالي الإيرادات', value: `${statsData?.total_revenue || 0}$`, icon: CreditCard, color: 'bg-amber-500', trend: 'أرباح' },
    { name: 'عمليات التسجيل', value: statsData?.total_enrollments || 0, icon: TrendingUp, color: 'bg-rose-500', trend: 'نمو' },
  ];

  const pendingPayments = allPayments?.filter((p: any) => p.status === 'pending') || [];
  const recentUsers = users?.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">لوحة تحكم المسؤول</h1>
          <p className="text-slate-500">مرحباً بك مجدداً، {user?.name}. إليك ملخص النظام اليوم.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/users" className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
            <UserPlus className="w-4 h-4" /> إدارة المستخدمين
          </Link>
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" /> التقارير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="text-white w-6 h-6" />
              </div>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm">{stat.name}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">المستخدمين المضافين حديثاً</h2>
          <Link to="/users" className="text-primary text-sm font-semibold hover:underline">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">المستخدم</th>
                <th className="px-6 py-4 font-semibold">الدور</th>
                <th className="px-6 py-4 font-semibold">تاريخ الانضمام</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentUsers?.map((u: import('../../types').User) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full capitalize">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(u.created_at || Date.now()).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      نشط
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Payments Section */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">مدفوعات بانتظار الموافقة</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
            {pendingPayments.length} معلقة
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">الطالب</th>
                <th className="px-6 py-4 font-semibold">الكورس</th>
                <th className="px-6 py-4 font-semibold">المبلغ</th>
                <th className="px-6 py-4 font-semibold">الوسيلة</th>
                <th className="px-6 py-4 font-semibold">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">لا توجد مدفوعات معلقة حالياً</td>
                </tr>
              ) : (
                pendingPayments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{p.student?.user?.name}</p>
                      <p className="text-xs text-slate-500">{p.student?.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.course?.title}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${p.amount}</td>
                    <td className="px-6 py-4 text-xs font-medium uppercase text-slate-500">{p.method}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => approveMutation.mutate(p.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all text-sm font-bold disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {approveMutation.isPending ? 'جاري...' : 'موافقة'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
