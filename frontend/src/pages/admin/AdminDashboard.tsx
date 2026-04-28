import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUsers, usePayments, useApprovePayment } from '../../hooks/useApiHooks';
import { Users, BookOpen, CreditCard, TrendingUp, UserPlus, FileText, CheckCircle, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
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

  const stats = [
    { name: t('total_users') || (lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'), value: statsData?.total_users || 0, icon: Users, color: 'primary', trend: '+12%' },
    { name: t('active_courses') || (lang === 'ar' ? 'الكورسات الفعالة' : 'Active Courses'), value: statsData?.active_courses || 0, icon: BookOpen, color: 'secondary', trend: 'Live' },
    { name: t('total_revenue') || (lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'), value: `${statsData?.total_revenue || 0}$`, icon: CreditCard, color: 'accent', trend: '+8.5%' },
    { name: t('total_enrollments') || (lang === 'ar' ? 'عمليات التسجيل' : 'Enrollments'), value: statsData?.total_enrollments || 0, icon: TrendingUp, color: 'primary', trend: 'Growing' },
  ];

  const pendingPayments = allPayments?.filter((p: any) => p.status === 'pending') || [];
  const recentUsers = users?.slice(-5).reverse();

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ar' ? `أهلاً بك، ${user?.name}` : `Welcome back, ${user?.name}`}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{lang === 'ar' ? 'لوحة التحكم للمسؤول - كامل الصلاحيات' : 'Admin Control Panel - Full Access'}</span>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-3">
          <Link to="/users" className="btn-primary group">
            <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
            {lang === 'ar' ? 'إضافة مستخدم' : 'Add User'}
          </Link>
          <button className="bg-card hover:bg-muted text-foreground border border-border px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm">
            <FileText className="w-4 h-4 text-primary" /> 
            {lang === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-6 group hover:border-primary/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
               <stat.icon className="w-24 h-24" />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20`}>
                <stat.icon className="text-primary w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-black text-foreground mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users Table */}
        <div className="lg:col-span-2 premium-card">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'المستخدمين الجدد' : 'Recent Users'}</h2>
            </div>
            <Link to="/users" className="text-primary text-xs font-black uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-6 py-4">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الدور' : 'Role'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'التاريخ' : 'Joined'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-sm font-black text-primary shadow-sm group-hover:scale-110 transition-transform">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black px-2.5 py-1 bg-muted border border-border rounded-lg uppercase tracking-tighter text-foreground">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(u.created_at || Date.now()).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments Widget */}
        <div className="premium-card h-fit">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-accent" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'طلبات دفع معلقة' : 'Pending Payments'}</h2>
            </div>
            <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-1 rounded-lg">
              {pendingPayments.length}
            </span>
          </div>
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {pendingPayments.length === 0 ? (
              <div className="py-12 text-center">
                 <CreditCard className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                 <p className="text-xs font-bold text-muted-foreground uppercase">{lang === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests'}</p>
              </div>
            ) : (
              pendingPayments.map((p: any) => (
                <div key={p.id} className="p-4 bg-muted/30 border border-border rounded-2xl group hover:bg-card hover:shadow-lg transition-all">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-black text-foreground">{p.student?.user?.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold truncate max-w-[150px]">{p.course?.title}</p>
                      </div>
                      <p className="text-lg font-black text-primary">${p.amount}</p>
                   </div>
                   <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-border/50">
                      <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted px-2 py-1 rounded-md">{p.method}</span>
                      <button
                        onClick={() => approveMutation.mutate(p.id)}
                        disabled={approveMutation.isPending}
                        className="btn-primary py-2 px-4 text-xs shadow-none hover:shadow-lg"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {approveMutation.isPending ? '...' : (lang === 'ar' ? 'اعتماد' : 'Approve')}
                      </button>
                   </div>
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
