import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, CheckCircle, FileText, Award, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('nav.myCourses'), value: '5', icon: <BookOpen />, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: t('common.completed', 'Completed'), value: '3', icon: <CheckCircle />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: t('nav.assignments'), value: '12', icon: <FileText />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: t('nav.certificates'), value: '2', icon: <Award />, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  const recentActivity = [
    { title: 'Web Development Fundamentals', type: 'Lesson', date: '2 hours ago', progress: 85 },
    { title: 'React Hooks Deep Dive', type: 'Assignment', date: 'Yesterday', progress: 100 },
    { title: 'JavaScript Basics Quiz', type: 'Quiz', date: '2 days ago', progress: 92 },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              {t('student.welcome', 'Welcome back, Student!')}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg">
              {t('student.dashboardSubtitle', 'Track your learning progress and upcoming tasks.')}
            </p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl border border-neutral-100 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 px-4 py-2">
              <TrendingUp className="text-emerald-500" size={20} />
              <div className="rtl:text-right">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">{t('student.overallProgress', 'Overall Progress')}</p>
                <p className="text-lg font-black text-neutral-900 dark:text-white leading-none">68%</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft hover:shadow-glow-sm transition-all rtl:text-right"
            >
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm rtl:ml-0 rtl:mr-auto`}>
                {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 28 })}
              </div>
              <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden">
              <div className="p-8 border-b border-neutral-50 dark:border-slate-800 flex items-center justify-between rtl:flex-row-reverse">
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">{t('student.recentActivity', 'Recent Activity')}</h2>
                <button className="text-primary-600 font-bold text-sm hover:underline">{t('common.viewAll')}</button>
              </div>
              <div className="divide-y divide-neutral-50 dark:divide-slate-800">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors rtl:flex-row-reverse">
                    <div className="flex items-center gap-6 rtl:flex-row-reverse">
                      <div className="w-14 h-14 bg-neutral-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-neutral-400">
                        {activity.type === 'Lesson' ? <Clock size={24} /> : activity.type === 'Quiz' ? <FileText size={24} /> : <CheckCircle size={24} />}
                      </div>
                      <div className="rtl:text-right">
                        <h4 className="font-bold text-neutral-900 dark:text-white text-lg">{activity.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 rounded-full">
                            {activity.type}
                          </span>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Clock size={12} /> {activity.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 rtl:flex-row-reverse">
                      <div className="text-right rtl:text-left">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t('common.score', 'Score')}</p>
                        <p className="font-black text-neutral-900 dark:text-white text-xl">{activity.progress}%</p>
                      </div>
                      <button className="p-3 bg-neutral-50 dark:bg-slate-800 text-neutral-400 hover:text-primary-600 rounded-xl transition-all">
                        <ChevronRight size={20} className="rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary-600 p-10 rounded-[2.5rem] text-white shadow-glow relative overflow-hidden rtl:text-right">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">{t('student.continueLearning', 'Continue Learning')}</h3>
                <p className="text-primary-100 text-sm mb-8 opacity-80">{t('student.continueLearningSubtitle', 'Pick up where you left off in your latest course.')}</p>
                <Link 
                  to="/my-courses"
                  className="inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-lg"
                >
                  {t('common.resume', 'Resume')}
                  <ChevronRight size={18} className="rtl:rotate-180" />
                </Link>
              </div>
              <BookOpen className="absolute -right-8 -bottom-8 opacity-10 scale-150 rotate-12" size={160} />
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft rtl:text-right">
              <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-6">{t('student.upcomingAssignments', 'Upcoming Tasks')}</h3>
              <div className="space-y-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex gap-4 items-start rtl:flex-row-reverse">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-sm">Database Schema Design</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Due in 3 days</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;