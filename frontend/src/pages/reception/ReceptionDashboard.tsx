import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { usePayments } from '../../hooks/useApiHooks';
import { Payment } from '../../types';
import { UserPlus, CreditCard, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ReceptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  if (statsLoading || paymentsLoading) return <LoadingSpinner />;

  const actions = [
    { name: 'إدارة الطلاب', icon: UserPlus, color: 'bg-primary', link: '/users' },
    { name: 'تحصيل مدفوعات', icon: CreditCard, color: 'bg-secondary', link: '/payments' },
    { name: 'إصدار إيصال', icon: Receipt, color: 'bg-amber-500', link: '/payments' },
  ];

  const recentPayments = payments?.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مكتب الاستقبال</h1>
          <p className="text-slate-500">مرحباً {user?.name}، كيف يمكنني مساعدتك اليوم؟</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link
            to={action.link}
            key={action.name}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 text-center group block"
          >
            <motion.div whileHover={{ y: -5 }} className={`${action.color} p-4 rounded-2xl shadow-lg shadow-primary/20 transition-transform`}>
              <action.icon className="text-white w-8 h-8" />
            </motion.div>
            <span className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{action.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">أحدث المعاملات</h2>
            <Link to="/payments" className="text-sm font-bold text-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">الطالب</th>
                  <th className="px-6 py-4 font-semibold">المبلغ</th>
                  <th className="px-6 py-4 font-semibold">التاريخ</th>
                  <th className="px-6 py-4 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentPayments?.map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{payment.student?.user?.name || 'مجهول'}</p>
                      <p className="text-xs text-slate-500">{payment.payment_method}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{payment.amount}$</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(payment.payment_date).toLocaleDateString('ar-SA')}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">مكتمل</span>
                    </td>
                  </tr>
                ))}
                {!recentPayments?.length && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-500 text-sm">لا توجد معاملات بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-slate-900">ملخص اليوم</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs">تسجيلات اليوم</p>
                <p className="text-xl font-bold text-slate-900">{statsData?.today_registrations || 0}</p>
              </div>
              <UserPlus className="text-primary w-6 h-6" />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs">إجمالي التحصيل</p>
                <p className="text-xl font-bold text-slate-900">{statsData?.today_payments || 0}$</p>
              </div>
              <CreditCard className="text-secondary w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
