import React, { useState } from 'react';
import { CreditCard, Filter, Search, CheckCircle2, Clock, XCircle, Receipt, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Payment } from '../types';
import { useAuth } from '../context/AuthContext';

interface PaymentWithMeta extends Payment {
  course?: { id: number; title: string };
}

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const { data: payments = [], isLoading } = useQuery<PaymentWithMeta[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/payments');
      return (res.data as any).data || res.data || [];
    },
  });

  const displayPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (p.student?.user?.name || '').toLowerCase().includes(q) ||
      (p.course?.title || '').toLowerCase().includes(q) ||
      (p.transaction_id || '').toLowerCase().includes(q)
    );
  });

  const totalPaid = displayPayments
    .filter(p => p.status === 'completed' || p.status === 'paid')
    .reduce((s, p) => s + Number(p.amount), 0);

  const normalizeStatus = (s: string) =>
    s === 'completed' ? 'paid' : s as 'paid' | 'pending' | 'failed';

  const statusCfg = {
    paid:    { label: 'مدفوع',   icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    pending: { label: 'معلق',    icon: Clock,        color: 'text-amber-600 bg-amber-50' },
    failed:  { label: 'فشل',     icon: XCircle,      color: 'text-red-600 bg-red-50' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المدفوعات والفواتير</h1>
          <p className="text-slate-500">
            {user?.role === 'student' ? 'سجل مدفوعاتك وفواتيرك.' : 'إدارة جميع معاملات الأكاديمية.'}
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'reception') && (
          <Link to="/register-student" className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> تسجيل طالب جديد
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي المحصّل',   value: `${totalPaid}$`,
            icon: CreditCard, color: 'bg-indigo-500' },
          { label: 'معاملات ناجحة',
            value: String(displayPayments.filter(p => p.status === 'completed' || p.status === 'paid').length),
            icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'معاملات معلّقة',
            value: String(displayPayments.filter(p => p.status === 'pending').length),
            icon: Clock, color: 'bg-amber-500' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-xl`}>
              <card.icon className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{card.label}</p>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="font-bold text-slate-900">سجل المعاملات</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  {(user?.role === 'admin' || user?.role === 'reception') && (
                    <th className="px-6 py-4 font-semibold">الطالب</th>
                  )}
                  <th className="px-6 py-4 font-semibold">الكورس</th>
                  <th className="px-6 py-4 font-semibold">المبلغ</th>
                  <th className="px-6 py-4 font-semibold">طريقة الدفع</th>
                  <th className="px-6 py-4 font-semibold">التاريخ</th>
                  <th className="px-6 py-4 font-semibold">الحالة</th>
                  <th className="px-6 py-4 font-semibold">إيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayPayments.map((payment, index) => {
                  const statusKey = normalizeStatus(payment.status);
                  const sc = statusCfg[statusKey] ?? statusCfg.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <motion.tr key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04 }} className="hover:bg-slate-50 transition-colors">
                      {(user?.role === 'admin' || user?.role === 'reception') && (
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {payment.student?.user?.name || '—'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {(payment as any).course?.title || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{payment.amount}$</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{payment.payment_method || '—'}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('ar-EG') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${sc.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to="/register-student"
                          className="flex items-center gap-1 text-primary hover:underline text-xs font-bold">
                          <Receipt className="w-4 h-4" /> إيصال
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {displayPayments.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-semibold">لا توجد معاملات بعد.</p>
                {(user?.role === 'admin' || user?.role === 'reception') && (
                  <Link to="/register-student" className="mt-4 inline-flex items-center gap-2 btn-primary text-sm">
                    <UserPlus className="w-4 h-4" /> تسجيل طالب جديد
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

