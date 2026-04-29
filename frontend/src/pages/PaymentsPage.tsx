import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Payment } from '../types';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, dir } = useLang();
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['payments', user?.id],
    queryFn: () => api.get('/payments').then(res => (res.data as any).data || res.data),
    enabled: !!user,
  });

  const filteredPayments = payments.filter(p => filterStatus === 'all' || p.status === filterStatus);

  const stats = {
    total: payments.reduce((sum, p) => p.status === 'completed' || p.status === 'paid' ? sum + Number(p.amount) : sum, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    completed: payments.filter(p => p.status === 'completed' || p.status === 'paid').length,
  };

  return (
    <div className="p-4 md:p-10 space-y-10" dir={dir}>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
             <span className="material-symbols-outlined text-xs">payments</span>
             {lang === 'ar' ? 'البيانات المالية' : 'Financial Ledger'}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-on-background tracking-tight leading-[1.1]">
            {lang === 'ar' ? 'المدفوعات والمعاملات' : 'Payments & Revenue'}
          </h1>
          <p className="text-on-surface-variant mt-4 text-lg font-medium">
             {user?.role === 'student' 
               ? (lang === 'ar' ? 'عرض وإدارة سجل مدفوعاتك المالية.' : 'View and manage your financial records.')
               : (lang === 'ar' ? 'متابعة التدفقات النقدية والتحصيل المالي.' : 'Monitor platform cash flow and collections.')}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {(user?.role === 'admin' || user?.role === 'reception' || user?.role === 'super_admin') && (
             <Link to="/register-student" className="bg-primary-container text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">add_card</span>
                {lang === 'ar' ? 'تسجيل وتحصيل' : 'Register & Pay'}
             </Link>
           )}
        </div>
      </header>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label_ar: 'إجمالي المحصل', label_en: 'Total Revenue', val: `$${stats.total.toLocaleString()}`, color: 'secondary', icon: 'account_balance_wallet' },
           { label_ar: 'دفعات معلقة', label_en: 'Pending Payments', val: stats.pending, color: 'tertiary', icon: 'pending_actions' },
           { label_ar: 'عمليات ناجحة', label_en: 'Successful Tasks', val: stats.completed, color: 'primary', icon: 'verified' }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm relative overflow-hidden group"
           >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 blur-3xl -z-10`} />
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-14 h-14 bg-${stat.color}/10 text-${stat.color} rounded-2xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-3xl fill-icon">{stat.icon}</span>
                 </div>
                 <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Insight</div>
              </div>
              <div className="text-4xl font-black text-on-background mb-2 tracking-tighter">{stat.val}</div>
              <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">
                {lang === 'ar' ? stat.label_ar : stat.label_en}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">list_alt</span>
            <h2 className="text-2xl font-black text-on-background tracking-tight">
              {lang === 'ar' ? 'سجل العمليات' : 'Transaction History'}
            </h2>
          </div>
          
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl gap-1">
            {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterStatus === status 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {lang === 'ar' 
                  ? (status === 'all' ? 'الكل' : status === 'completed' ? 'ناجح' : status === 'pending' ? 'معلق' : 'فاشل')
                  : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={dir}>
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'المعرف' : 'ID'}</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'الطالب' : 'Student'}</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'الوسيلة' : 'Method'}</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-on-surface-variant">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-8 py-6"><div className="h-4 bg-surface-container-low rounded-full w-24"></div></td>
                      ))}
                    </tr>
                  ))
                ) : filteredPayments.map((payment) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={payment.id} 
                    className="hover:bg-surface-container-low/30 transition-colors group"
                  >
                    <td className="px-8 py-6 font-mono text-sm text-on-surface-variant">#{payment.id}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-on-background group-hover:text-primary transition-colors">
                        {payment.student?.user?.name || 'Loading...'}
                      </div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-60">
                        {payment.student?.user?.login_id}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-on-background text-lg">${Number(payment.amount).toLocaleString()}</td>
                    <td className="px-8 py-6 text-on-surface-variant font-medium">
                      {format(new Date(payment.payment_date), 'PPP', { locale: lang === 'ar' ? arSA : enUS })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface-variant border border-outline-variant">
                        <span className="material-symbols-outlined text-sm">credit_card</span>
                        {payment.payment_method}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        payment.status === 'completed' || payment.status === 'paid' 
                          ? 'bg-secondary/10 text-secondary' 
                          : payment.status === 'pending'
                          ? 'bg-tertiary/10 text-tertiary'
                          : 'bg-error/10 text-error'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {lang === 'ar' 
                          ? (payment.status === 'completed' || payment.status === 'paid' ? 'مكتمل' : payment.status === 'pending' ? 'قيد الانتظار' : 'فاشل')
                          : payment.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {!isLoading && filteredPayments.length === 0 && (
            <div className="p-32 text-center space-y-6">
              <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">payments</span>
              </div>
              <h3 className="text-2xl font-black text-on-background">
                {lang === 'ar' ? 'لا توجد معاملات مالية' : 'No Transactions Found'}
              </h3>
              <p className="text-on-surface-variant max-w-sm mx-auto font-medium">
                {lang === 'ar' ? 'لا تتوفر أي سجلات دفع تطابق التصفية الحالية.' : 'No payment records available matching the current filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
