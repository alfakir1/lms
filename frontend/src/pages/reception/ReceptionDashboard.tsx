import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { usePayments } from '../../hooks/useApiHooks';
import { Payment } from '../../types';
import { UserPlus, CreditCard, Receipt, ArrowUpRight, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const ReceptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  if (statsLoading || paymentsLoading) return <LoadingSpinner />;

  const actions = [
    { name: lang === 'ar' ? 'إدارة الطلاب' : 'Manage Students', icon: UserPlus, color: 'primary', link: '/users' },
    { name: lang === 'ar' ? 'تحصيل مدفوعات' : 'Collect Payments', icon: CreditCard, color: 'secondary', link: '/payments' },
    { name: lang === 'ar' ? 'إصدار إيصال' : 'Issue Receipt', icon: Receipt, color: 'accent', link: '/payments' },
  ];

  const recentPayments = payments?.slice(-5).reverse();

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ar' ? `أهلاً بك، ${user?.name}` : `Welcome, ${user?.name}`}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <span>{lang === 'ar' ? 'مكتب الاستقبال والتسجيل' : 'Front Desk & Registration'}</span>
          </div>
        </motion.div>
        
        <Link to="/register-student" className="btn-primary">
          <UserPlus className="w-4 h-4" /> {lang === 'ar' ? 'تسجيل طالب جديد' : 'Register New Student'}
        </Link>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <Link
            to={action.link}
            key={action.name}
            className="premium-card p-10 flex flex-col items-center gap-6 text-center group hover:bg-muted/30 transition-all border-2 border-transparent hover:border-primary/20"
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`w-20 h-20 bg-${action.color}/10 rounded-[2rem] flex items-center justify-center border border-${action.color}/20`}>
              <action.icon className={`text-${action.color} w-10 h-10`} />
            </motion.div>
            <div>
               <span className="font-black text-foreground text-xl block mb-1 group-hover:text-primary transition-colors">{action.name}</span>
               <p className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'الوصول السريع للخدمة' : 'Quick access to service'}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 premium-card">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-primary" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'أحدث المعاملات' : 'Recent Transactions'}</h2>
            </div>
            <Link to="/payments" className="text-primary text-xs font-black uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الطالب' : 'Student'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentPayments?.map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-sm font-black text-primary group-hover:scale-110 transition-transform">
                          {payment.student?.user?.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">{payment.student?.user?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{payment.payment_method}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-black text-foreground">${payment.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(payment.payment_date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase">{lang === 'ar' ? 'تم الدفع' : 'Paid'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {!recentPayments?.length && (
                  <tr><td colSpan={4} className="text-center py-20 text-muted-foreground font-bold italic">{lang === 'ar' ? 'لا توجد معاملات بعد' : 'No transactions yet'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="space-y-6 h-fit">
          <div className="premium-card p-8 bg-primary text-primary-foreground relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-lg">Today</span>
             </div>
             <p className="text-sm font-bold opacity-80 mb-1">{lang === 'ar' ? 'إجمالي التحصيل اليوم' : 'Total Collected Today'}</p>
             <h3 className="text-4xl font-black mb-6">${statsData?.today_payments || 0}</h3>
             <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black opacity-60 uppercase">{lang === 'ar' ? 'تسجيلات اليوم' : 'Registrations'}</p>
                   <p className="text-lg font-black">{statsData?.today_registrations || 0}</p>
                </div>
                <Link to="/register-student" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary hover:scale-110 transition-transform">
                   <ArrowUpRight className="w-5 h-5" />
                </Link>
             </div>
          </div>
          
          <div className="premium-card p-6 bg-card border border-border">
             <h3 className="font-black text-foreground mb-4">{lang === 'ar' ? 'تذكير سريع' : 'Quick Reminder'}</h3>
             <div className="space-y-3">
                {[
                   lang === 'ar' ? 'تأكد من تسليم الإيصالات للطلاب' : 'Hand out receipts to students',
                   lang === 'ar' ? 'تحقق من هوية الطلاب الجدد' : 'Verify new students identity',
                   lang === 'ar' ? 'تحديث سجلات الحضور اليومية' : 'Update daily attendance logs'
                ].map((note, i) => (
                   <div key={i} className="flex items-center gap-3 text-xs font-bold text-muted-foreground p-3 bg-muted/50 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {note}
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
