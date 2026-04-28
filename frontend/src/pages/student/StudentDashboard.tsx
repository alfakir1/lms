import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { BookOpen, Award, Clock, Activity, PlayCircle, ChevronLeft, ArrowUpRight, GraduationCap, FileText } from 'lucide-react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t, dir } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const stats = [
    { name: lang === 'ar' ? 'كورساتي' : 'My Courses', value: statsData?.enrolled_courses || 0, icon: BookOpen, color: 'primary' },
    { name: lang === 'ar' ? 'الشهادات' : 'Certificates', value: '0', icon: Award, color: 'accent' },
    { name: lang === 'ar' ? 'ساعات التعلم' : 'Learning Hours', value: '12h', icon: Clock, color: 'secondary' },
    { name: lang === 'ar' ? 'معدل الحضور' : 'Attendance', value: '95%', icon: Activity, color: 'primary' },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ar' ? `مرحباً بك، ${user?.name}` : `Welcome back, ${user?.name}`}
          </h1>
          <p className="text-muted-foreground font-medium">
            {lang === 'ar' ? 'واصل رحلتك نحو التميز والإبداع اليوم!' : 'Continue your journey towards excellence and creativity today!'}
          </p>
        </motion.div>
        
        <Link to="/courses" className="btn-primary">
          <GraduationCap className="w-4 h-4" /> {lang === 'ar' ? 'استكشاف كورسات جديدة' : 'Explore New Courses'}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-6 flex items-center gap-5 group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <stat.icon className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.name}</p>
              <p className="text-2xl font-black text-foreground mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-foreground tracking-tight">{lang === 'ar' ? 'واصل التعلم' : 'Continue Learning'}</h2>
            <Link to="/courses" className="text-xs font-black text-primary uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          
          <div className="space-y-4">
            {courses?.slice(0, 3).map((course) => (
              <div key={course.id} className="premium-card p-5 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/50 transition-colors">
                <div className="w-full md:w-56 h-36 bg-muted rounded-2xl overflow-hidden relative shrink-0 border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center z-20">
                     <p className="text-sm font-black text-white drop-shadow-md">{course.title}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-black text-foreground text-lg mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'الدرس القادم: مقدمة في المساق' : 'Next Lesson: Introduction'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <span>{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '15%' }} 
                        className="h-full bg-primary rounded-full" 
                      />
                    </div>
                  </div>
                  
                  <Link to={`/courses/${course.id}/play`} className="inline-flex items-center justify-center gap-2 w-full bg-muted hover:bg-primary hover:text-primary-foreground py-3 rounded-xl text-xs font-black transition-all border border-border group-hover:border-primary">
                    {lang === 'ar' ? 'متابعة التعلم' : 'Resume Learning'} <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            {courses?.length === 0 && (
              <div className="py-20 text-center premium-card">
                 <BookOpen className="w-16 h-16 text-muted/30 mx-auto mb-4" />
                 <p className="text-sm font-bold text-muted-foreground italic">
                   {lang === 'ar' ? 'لم تسجل في أي كورسات بعد.' : 'You haven\'t enrolled in any courses yet.'}
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* Assignments/Sidebar */}
        <div className="space-y-8">
          <div className="premium-card">
            <div className="p-6 border-b border-border bg-muted/30">
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'المهام القادمة' : 'Upcoming Tasks'}</h2>
            </div>
            <div className="p-8 text-center h-[300px] flex flex-col items-center justify-center">
                 <FileText className="w-12 h-12 text-muted/30 mb-4" />
                 <p className="text-sm font-bold text-muted-foreground italic">
                   {lang === 'ar' ? 'لا توجد مهام مستحقة حالياً.' : 'No tasks due at the moment.'}
                 </p>
            </div>
          </div>
          
          <div className="premium-card p-6 bg-primary text-primary-foreground relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <h3 className="text-xl font-black mb-2">{lang === 'ar' ? 'احصل على شهادتك' : 'Get Your Certificate'}</h3>
             <p className="text-xs font-medium text-white/80 mb-6 leading-relaxed">
               {lang === 'ar' ? 'أكمل جميع الدروس والمهام للحصول على شهادة معتمدة من الأكاديمية.' : 'Complete all lessons and assignments to get a certified certificate.'}
             </p>
             <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-transform">
                {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
