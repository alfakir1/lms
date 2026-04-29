import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, dir } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const profName = user?.name || (lang === 'ar' ? 'المحاضر المميز' : 'Elite Professor');

  return (
    <div className="space-y-10" dir={dir}>
      {/* ─── Header Section ─── */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            {lang === 'ar' ? `لوحة تحكم المحاضر - 4A Academy` : `Instructor Workspace - 4A Academy`}
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
             {lang === 'ar' 
               ? `مرحباً أستاذ ${profName}، إليك ملخص لأداء دوراتك وطلابك اليوم.` 
               : `Hello Prof. ${profName}, here's a strategic summary of your courses and academic metrics today.`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">notifications</span>
           </button>
           <div className="h-10 w-[1px] bg-outline-variant/30" />
           <Link to="/courses" className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              {lang === 'ar' ? 'إضافة دورة جديدة' : 'Launch New Course'}
           </Link>
        </div>
      </header>

      {/* ─── Bento Overview Stats ─── */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {[
          { icon: 'groups', label_ar: 'إجمالي الطلاب', label_en: 'Enrolled Cohort', val: statsData?.total_students || '1,429', color: 'primary', trend: '+8.2%' },
          { icon: 'star', label_ar: 'تقييم المحاضر', label_en: 'Instructor Rating', val: '4.9', color: 'secondary', trend: 'Elite' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 bg-surface-container-low text-${stat.color === 'primary' ? 'primary' : 'secondary'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl fill-icon">{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.color === 'primary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              {lang === 'ar' ? stat.label_ar : stat.label_en}
            </div>
            <div className="text-3xl font-black text-on-surface tracking-tighter">
              {stat.val}
            </div>
          </motion.div>
        ))}

        {/* Live Session Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-primary-container text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden group"
        >
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2">
                  {lang === 'ar' ? 'جلسة مباشرة غداً!' : 'Live Session Tomorrow!'}
                </h3>
                <p className="text-sm opacity-90 max-w-[300px] font-medium leading-relaxed">
                   {lang === 'ar' 
                     ? 'لديك محاضرة تفاعلية في دورة "الذكاء الاصطناعي" غداً الساعة 10 صباحاً.' 
                     : 'You have a high-impact interactive session for "AI Architect" tomorrow at 10:00 AM.'}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                 <button className="bg-white text-primary px-5 py-2.5 rounded-lg text-sm font-black hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
                    {lang === 'ar' ? 'تحميل المحتوى' : 'Push Content'}
                 </button>
                 <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-lg text-sm font-black hover:bg-white/20 transition-all">
                    {lang === 'ar' ? 'عرض الجدول' : 'Full Schedule'}
                 </button>
              </div>
           </div>
           <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute top-0 right-0 p-6 opacity-20">
              <span className="material-symbols-outlined text-[100px]">co_present</span>
           </div>
        </motion.div>
      </section>

      {/* ─── Active Courses & Performance ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Course Performance (Left) */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
           <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="text-xl font-black text-on-surface tracking-tight">{lang === 'ar' ? 'أداء المسارات التعليمية' : 'Course Performance'}</h3>
              <Link to="/courses" className="text-primary font-black text-xs uppercase tracking-widest hover:underline">
                 {lang === 'ar' ? 'إدارة كافة الدورات' : 'Manage All Assets'}
              </Link>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses?.slice(0, 4).map((course, i) => (
                <div key={course.id} className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/30 hover:border-primary-container/30 transition-all group">
                   <div className="flex gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-surface-container-lowest border border-outline-variant/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                         <span className="material-symbols-outlined text-primary-container text-3xl">school</span>
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-on-surface line-clamp-2 leading-snug">{course.title}</h4>
                         <p className="text-[10px] text-on-surface-variant/60 font-black uppercase tracking-widest mt-1.5">{course.category || 'ACADEMIC'}</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                      <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-bold">
                         <span className="material-symbols-outlined text-sm">group</span>
                         {Math.floor(Math.random() * 100) + 40} {lang === 'ar' ? 'طالب' : 'Students'}
                      </div>
                      <Link to={`/courses/${course.id}`} className="text-primary-container font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         {lang === 'ar' ? 'عرض التفاصيل' : 'View Meta'}
                         <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Needs Grading (Right) */}
        <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
           <h3 className="text-xl font-black text-on-surface mb-8">{lang === 'ar' ? 'بانتظار التقييم' : 'Action Required'}</h3>
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                   <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 border border-outline-variant/30 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-xl">description</span>
                   </div>
                   <div className="flex-1">
                      <h5 className="text-sm font-black text-on-surface leading-none mb-1.5">{lang === 'ar' ? `المهمة ${i}: تحليل البيانات` : `Deliverable ${i}: Deep Analysis`}</h5>
                      <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{lang === 'ar' ? 'من: سارة محمد' : 'From: Sara Mohammad'}</p>
                      <button className="mt-2 text-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {lang === 'ar' ? 'تقييم الآن' : 'Grade Now'}
                      </button>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-3.5 bg-surface-container-low text-on-surface font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/30">
              {lang === 'ar' ? 'عرض كافة التسليمات' : 'Process All Submissions'}
           </button>
        </section>

      </div>
    </div>
  );
};

export default InstructorDashboard;
