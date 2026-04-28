import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { BookOpen, FileText, CheckCircle, Plus, Users, Layout, ArrowUpRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const stats = [
    { name: lang === 'ar' ? 'كورساتي' : 'My Courses', value: statsData?.my_courses || 0, icon: BookOpen, color: 'primary' },
    { name: lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students', value: statsData?.total_students || 0, icon: Users, color: 'secondary' },
    { name: lang === 'ar' ? 'المهام المعلقة' : 'Pending Tasks', value: '0', icon: FileText, color: 'accent' },
    { name: lang === 'ar' ? 'التقييم العام' : 'Overall Rating', value: '4.8/5', icon: CheckCircle, color: 'primary' },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ar' ? `أهلاً بك، أ. ${user?.name}` : `Welcome, Prof. ${user?.name}`}
          </h1>
          <p className="text-muted-foreground font-medium">
            {lang === 'ar' ? 'إدارة رحلتك التعليمية وطلابك بكل سهولة.' : 'Manage your teaching journey and students with ease.'}
          </p>
        </motion.div>
        
        <Link to="/courses" className="btn-primary">
          <Plus className="w-4 h-4" /> {lang === 'ar' ? 'عرض كافة كورساتي' : 'View My Courses'}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <stat.icon className="text-primary w-6 h-6" />
              </div>
              <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase">
                Active
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Courses */}
        <div className="premium-card">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layout className="w-4 h-4 text-primary" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'أحدث الكورسات' : 'Recent Courses'}</h2>
            </div>
            <Link to="/courses" className="text-primary text-xs font-black uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="p-4 space-y-3">
            {courses?.slice(0, 4).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-muted/30 hover:bg-card border border-transparent hover:border-border rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <GraduationCap className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-foreground text-sm line-clamp-1">{course.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{course.status || 'Active'}</p>
                  </div>
                </div>
                <Link to={`/courses/${course.id}`} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
            {courses?.length === 0 && (
              <div className="py-12 text-center text-muted-foreground font-bold italic">
                {lang === 'ar' ? 'لا توجد كورسات مضافة بعد.' : 'No courses added yet.'}
              </div>
            )}
          </div>
        </div>

        {/* Task Submissions */}
        <div className="premium-card">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'تسليمات المهام' : 'Submissions'}</h2>
            </div>
            <Link to="/assignments" className="text-primary text-xs font-black uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center h-[300px]">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/30" />
             </div>
             <p className="text-sm font-bold text-muted-foreground italic">
               {lang === 'ar' ? 'لا توجد تسليمات جديدة حالياً.' : 'No new submissions at the moment.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
