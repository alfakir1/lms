import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  CreditCard, 
  UserPlus, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockPayments, mockUsers } from '../../utils/mockData';

const ReceptionDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Stats calculation
  const totalSales = mockPayments.reduce((acc, p) => acc + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const recentRegistrations = mockUsers.filter(u => u.role === 'student').slice(-5).reverse();

  const stats = [
    { 
      label: t('reception.totalSales', 'Total Sales'), 
      value: String(t('common.currency', { val: totalSales })), 
      icon: CreditCard, 
      color: 'bg-emerald-500',
      trend: '+12.5%'
    },
    { 
      label: t('reception.newStudents', 'New Students'), 
      value: '24', 
      icon: UserPlus, 
      color: 'bg-blue-500',
      trend: '+8%'
    },
    { 
      label: t('reception.pendingPayments', 'Pending Payments'), 
      value: pendingPayments.toString(), 
      icon: Clock, 
      color: 'bg-amber-500',
      trend: '-2'
    },
    { 
      label: t('reception.todaySales', 'Today\'s Sales'), 
      value: String(t('common.currency', { val: 450 })), 
      icon: TrendingUp, 
      color: 'bg-indigo-500',
      trend: '+15%'
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rtl:flex-row-reverse">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.dashboardTitle', 'Reception Dashboard')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.subtitle', 'Monitor registrations and payment flows')}
          </p>
        </div>
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <Link 
            to="/reception/register"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-glow transition-all flex items-center gap-2 rtl:flex-row-reverse"
          >
            <UserPlus size={18} />
            {t('reception.registerStudent', 'Register Student')}
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft hover:shadow-glow-sm transition-all group rtl:text-right"
          >
            <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-400 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-neutral-50 dark:border-slate-800 flex items-center justify-between rtl:flex-row-reverse">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 rtl:flex-row-reverse">
              <Users size={20} className="text-primary-500" />
              {t('reception.recentRegistrations', 'Recent Registrations')}
            </h3>
            <button className="text-sm text-primary-600 font-semibold hover:underline">
              {t('common.viewAll', 'View All')}
            </button>
          </div>
          <div className="divide-y divide-neutral-50 dark:divide-slate-800">
            {recentRegistrations.map((student) => (
              <div key={student.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between rtl:flex-row-reverse">
                <div className="flex items-center gap-3 rtl:flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold shrink-0">
                    {student.name?.charAt(0)}
                  </div>
                  <div className="rtl:text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{student.email}</p>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {new Date(student.created_at).toLocaleDateString()}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 flex items-center justify-end rtl:justify-start gap-1">
                    <CheckCircle2 size={10} />
                    {t('common.active', 'Active')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-glow relative overflow-hidden group rtl:text-right">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 uppercase">{t('reception.quickActions', 'Quick Actions')}</h3>
              <p className="text-primary-100 text-sm mb-6">{t('reception.quickActionsDesc', 'Access common administrative tasks instantly.')}</p>
              <div className="grid grid-cols-2 gap-3 rtl:flex-row-reverse">
                <Link to="/reception/register" className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all text-center">
                  <UserPlus className="mx-auto mb-2" size={20} />
                  <span className="text-xs font-medium">{t('reception.newStudent', 'New Student')}</span>
                </Link>
                <Link to="/reception/payments" className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all text-center">
                  <CreditCard className="mx-auto mb-2" size={20} />
                  <span className="text-xs font-medium">{t('reception.payment', 'Payment')}</span>
                </Link>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 rtl:right-auto rtl:-left-4">
              <TrendingUp size={120} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-neutral-100 dark:border-slate-800 shadow-soft rtl:text-right">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2 rtl:flex-row-reverse">
              <BookOpen size={18} className="text-indigo-500" />
              {t('reception.popularCourses', 'Popular Courses')}
            </h3>
            <div className="space-y-4">
              {['Full-Stack Web Dev', 'UI/UX Design', 'Data Science'].map((c, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer rtl:flex-row-reverse">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 transition-colors">{c}</span>
                  <ArrowUpRight size={14} className="text-neutral-400 group-hover:text-primary-600 transition-colors rtl:rotate-[-90deg]" />
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
