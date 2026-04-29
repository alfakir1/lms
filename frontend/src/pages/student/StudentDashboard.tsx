import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, dir } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const studentName = user?.name || (lang === 'ar' ? 'طالبنا المميز' : 'Elite Student');

  return (
    <div className="space-y-10" dir={dir}>
      {/* ─── Header Section ─── */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            {lang === 'ar' ? `لوحة تحكم الطالب - 4A Academy` : `Student Dashboard - 4A Academy`}
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
             {lang === 'ar' 
               ? `أهلاً بك مجدداً، ${studentName}. تابع تقدمك التعليمي اليوم.` 
               : `Welcome back, ${studentName}. Track your educational progress today.`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">notifications</span>
           </button>
           <div className="h-10 w-[1px] bg-outline-variant/30" />
           <Link to="/courses" className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              {lang === 'ar' ? 'استكشاف الدورات' : 'Explore Courses'}
           </Link>
        </div>
      </header>

      {/* ─── Bento Overview Stats ─── */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {[
          { icon: 'auto_stories', label_ar: 'الدورات المكتملة', label_en: 'Completed Courses', val: '12', color: 'primary', trend: '+2' },
          { icon: 'grade', label_ar: 'متوسط التقييم', label_en: 'Average Grade', val: '94.5%', color: 'secondary', trend: 'Top 5%' },
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
                {stat.trend} {lang === 'ar' ? 'هذا الشهر' : 'this month'}
              </span>
            </div>
            <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              {lang === 'ar' ? stat.label_ar : stat.label_en}
            </div>
            <div className="text-3xl font-black text-on-surface tracking-tighter">
              {stat.val} {stat.icon === 'auto_stories' && (lang === 'ar' ? 'دورة' : 'Courses')}
            </div>
          </motion.div>
        ))}

        {/* Promo Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-primary-container text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden group"
        >
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2">
                  {lang === 'ar' ? 'استعد للاختبار القادم!' : 'Ready for the next test?'}
                </h3>
                <p className="text-sm opacity-90 max-w-[260px] font-medium">
                   {lang === 'ar' 
                     ? 'اختبار "أساسيات التصميم الرقمي" سيبدأ خلال يومين. قم بمراجعة المحاضرات الآن.' 
                     : 'The "Digital Design Fundamentals" test starts in 2 days. Review the lectures now.'}
                </p>
              </div>
              <button className="w-fit bg-white text-primary px-5 py-2.5 rounded-lg text-sm font-black mt-4 hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
                 {lang === 'ar' ? 'بدء المراجعة' : 'Start Review'}
              </button>
           </div>
           <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute top-0 right-0 p-6 opacity-20">
              <span className="material-symbols-outlined text-[100px]">event_upcoming</span>
           </div>
        </motion.div>
      </section>

      {/* ─── Continue Learning Section ─── */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            {lang === 'ar' ? 'واصل التعلم' : 'Continue Learning'}
          </h2>
          <Link to="/courses" className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
            {lang === 'ar' ? 'مشاهدة الكل' : 'View All'}
            <span className="material-symbols-outlined text-sm">{dir === 'rtl' ? 'arrow_back_ios' : 'arrow_forward_ios'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {courses?.slice(0, 3).map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative h-48 bg-surface-container-low overflow-hidden">
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest z-10 border border-outline-variant/30">
                    {lang === 'ar' ? 'المستوى المتقدم' : 'Advanced Level'}
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center p-8">
                    <h4 className="text-xl font-black text-center text-on-surface line-clamp-2">{course.title}</h4>
                 </div>
              </div>
              <div className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-container bg-primary/5 px-2 py-0.5 rounded">
                       {course.category || 'ACADEMIC'}
                    </span>
                    <span className="text-xs text-on-surface-variant/60 font-medium italic">• 12 {lang === 'ar' ? 'درس متبقي' : 'Lessons left'}</span>
                 </div>
                 <h4 className="text-lg font-black text-on-surface mb-6 leading-tight h-14 line-clamp-2">{course.title}</h4>
                 <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-center text-xs font-black">
                       <span className="text-on-surface-variant">{lang === 'ar' ? 'التقدم: 75%' : 'Progress: 75%'}</span>
                       <span className="text-secondary">{lang === 'ar' ? 'جيد جداً' : 'Very Good'}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                       <div className="h-full bg-secondary w-3/4 rounded-full shadow-[0_0_10px_rgba(var(--secondary),0.3)]" />
                    </div>
                 </div>
                 <Link 
                   to={`/courses/${course.id}/play`}
                   className="w-full py-3 bg-surface-container-low text-on-surface font-black text-sm rounded-xl hover:bg-primary-container hover:text-on-primary transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                 >
                   <span className="material-symbols-outlined text-sm">play_circle</span>
                   {lang === 'ar' ? 'متابعة الدرس' : 'Continue Lesson'}
                 </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Assignments & Activities ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
            <h3 className="text-xl font-black text-on-surface tracking-tight">{lang === 'ar' ? 'التكليفات' : 'Assignments'}</h3>
            <span className="material-symbols-outlined text-on-surface-variant/40 cursor-pointer">more_horiz</span>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container-low/50 transition-colors">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${i === 1 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined">{i === 1 ? 'description' : 'code'}</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-black text-on-surface">تحليل تجربة المستخدم - المرحلة {i}</h5>
                  <p className="text-xs text-on-surface-variant/60 font-medium">{lang === 'ar' ? 'موعد التسليم: الخميس، 14 أكتوبر' : 'Due: Thursday, Oct 14'}</p>
                </div>
                <button className={`text-xs font-black px-4 py-2 rounded-lg border transition-all ${i === 1 ? 'border-error/30 text-error hover:bg-error/5' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}>
                  {i === 1 ? (lang === 'ar' ? 'تسليم الآن' : 'Submit Now') : (lang === 'ar' ? 'مراجعة' : 'Review')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Feed */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">{lang === 'ar' ? 'تحديثات المعلمين' : 'Instructor Feed'}</h3>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-primary/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-on-surface">{lang === 'ar' ? 'د. خالد الرويلي' : 'Dr. Khalid Al-Rowaily'}</p>
                <p className="text-[10px] text-on-surface-variant/50 font-black uppercase tracking-widest mb-2">{lang === 'ar' ? 'منذ ساعتين' : '2 hours ago'}</p>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-[13px] text-on-surface-variant leading-relaxed font-medium italic">
                  "ممتاز يا أحمد، لاحظت تطوراً كبيراً في آخر تسليم لك. استمر على هذا المنوال!"
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 text-primary-container font-black text-xs uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all border border-primary/10">
            {lang === 'ar' ? 'تواصل مع المعلمين' : 'Contact Instructors'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
