import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { usePayments } from '../../hooks/useApiHooks';
import { Payment } from '../../types';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const ReceptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  if (statsLoading || paymentsLoading) return <LoadingSpinner />;

  const recentPayments = payments?.slice(-5).reverse() || [];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 font-heading">
          {lang === 'ar' ? 'لوحة تحكم مركز الاستقبال' : 'Reception Dashboard'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {lang === 'ar' ? `مرحباً بك مجدداً، ${user?.name} إِليك نظرة على نشاط اليوم` : `Welcome back, ${user?.name}. Here's today's activity.`}
        </p>
      </header>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* New Registrations */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <span className="material-symbols-outlined text-emerald-600 fill-icon">person_add</span>
            </div>
            <span className="text-emerald-600 flex items-center gap-1 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              12%+
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
            {lang === 'ar' ? 'تسجيلات اليوم' : 'Daily Registrations'}
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{statsData?.today_registrations || 0} {lang === 'ar' ? 'طالب' : 'Students'}</p>
        </div>

        {/* Payments Collected */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 blur-3xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-container/20 p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary-container fill-icon">payments</span>
            </div>
            <span className="text-primary-container flex items-center gap-1 text-sm font-bold bg-primary-container/10 px-2 py-1 rounded-lg">
              {lang === 'ar' ? 'يومي' : 'Daily'}
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
            {lang === 'ar' ? 'المدفوعات المحصلة' : 'Payments Collected'}
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {statsData?.today_payments || 0} {lang === 'ar' ? 'ر.س' : 'SAR'}
          </p>
        </div>

        {/* Pending Confirmations */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-3xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <span className="material-symbols-outlined text-orange-600 fill-icon">pending_actions</span>
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
            {lang === 'ar' ? 'طلاب بانتظار التأكيد' : 'Pending Students'}
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">15 {lang === 'ar' ? 'طالب' : 'Students'}</p>
        </div>
      </div>

      {/* Actions & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'أحدث العمليات المالية' : 'Recent Transactions'}
            </h3>
            <button className="text-primary-container text-sm font-bold hover:underline">
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                    {lang === 'ar' ? 'اسم الطالب' : 'Student Name'}
                  </th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                    {lang === 'ar' ? 'المبلغ' : 'Amount'}
                  </th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                    {lang === 'ar' ? 'التاريخ' : 'Date'}
                  </th>
                  <th className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider text-center">
                    {lang === 'ar' ? 'الإجراء' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {recentPayments.map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-xs font-bold text-primary-container">
                          {payment.student?.user?.name?.[0] || 'S'}
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold">{payment.student?.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {payment.amount} {lang === 'ar' ? 'ر.س' : 'SAR'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(payment.payment_date).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-xs font-bold transition-all active:scale-95 text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-sm">print</span>
                        {lang === 'ar' ? 'طباعة الإيصال' : 'Print Receipt'}
                      </button>
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                      {lang === 'ar' ? 'لا توجد عمليات مؤخراً' : 'No recent transactions'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-white/5 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {lang === 'ar' ? 'التسجيل السريع' : 'Quick Registration'}
            </h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'اسم الطالب بالكامل' : 'Student Full Name'}
                </label>
                <input 
                  className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 border rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none" 
                  placeholder={lang === 'ar' ? "أدخل الاسم..." : "Enter name..."}
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                </label>
                <input 
                  className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 border rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none text-left" 
                  dir="ltr" 
                  placeholder="05xxxxxxxx" 
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'اختيار الدورة' : 'Select Course'}
                </label>
                <select className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 border rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none appearance-none">
                  <option>إدارة الأعمال المتقدمة</option>
                  <option>أساسيات التصميم الرقمي</option>
                  <option>الذكاء الاصطناعي للمدراء</option>
                  <option>التسويق الاستراتيجي</option>
                </select>
              </div>
              <button 
                className="w-full bg-primary-container text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                type="submit"
              >
                {lang === 'ar' ? 'إتمام التسجيل والتحصيل' : 'Complete Registration'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                  {lang === 'ar' 
                    ? 'سيتم إرسال رسالة نصية للطالب تحتوي على بيانات الدخول فور إتمام عملية الدفع.' 
                    : 'A text message will be sent to the student with login details immediately after payment.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
