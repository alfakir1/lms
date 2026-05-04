import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { BookOpen, FileText, CheckCircle, Plus, Users, Layout, ArrowUpRight, GraduationCap, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { Submission } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

import { DashboardSkeleton } from '../../components/ui/Skeleton';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  
  const { data: submissionsRes, isLoading: submissionsLoading } = useQuery<{ success: boolean, data: Submission[] }>({
    queryKey: ['recent-submissions'],
    queryFn: async () => {
        const res = await api.get('/submissions');
        return res.data;
    }
  });
  const submissions = submissionsRes?.data || [];

  if (statsLoading || coursesLoading || submissionsLoading) return <DashboardSkeleton />;

  const stats = [
    { name: lang === 'ar' ? 'كورساتي' : 'My Courses', value: statsData?.my_courses || 0, icon: BookOpen, color: 'primary' },
    { name: lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students', value: statsData?.total_students || 0, icon: Users, color: 'secondary' },
    { name: lang === 'ar' ? 'المهام المعلقة' : 'Pending Tasks', value: statsData?.pending_submissions || 0, icon: FileText, color: 'accent' },
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

      {/* AI Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Link
          to="/ai/generate-assessment"
          className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 p-6 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="relative flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Powered by Gemini AI</span>
                  <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {lang === 'ar' ? 'أنشئ اختباراً ذكياً من كورسك' : 'Generate AI Assessment from Your Course'}
                </h2>
                <p className="text-white/70 text-sm font-medium mt-1">
                  {lang === 'ar'
                    ? 'يحلل الذكاء الاصطناعي دروسك ويولد أسئلة اختيار متعدد تلقائياً.'
                    : 'AI analyzes your lessons and auto-generates multiple-choice questions.'}
                </p>
              </div>
            </div>
            <div className="shrink-0 hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-2xl font-black text-sm transition-all group-hover:translate-x-1">
              <Zap className="w-4 h-4" />
              {lang === 'ar' ? 'جرّبه الآن' : 'Try Now'}
            </div>
          </div>
        </Link>
      </motion.div>

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
        <div className="premium-card flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
               </div>
               <h2 className="font-black text-foreground tracking-tight">{lang === 'ar' ? 'أحدث التسليمات' : 'Recent Submissions'}</h2>
            </div>
            <Link to="/assignments" className="text-primary text-xs font-black uppercase hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {submissionsLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
            ) : submissions?.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                   <FileText className="w-12 h-12 mb-4" />
                   <p className="text-sm font-bold">{lang === 'ar' ? 'لا توجد تسليمات جديدة.' : 'No new submissions.'}</p>
                </div>
            ) : (
                submissions?.slice(0, 5).map(sub => (
                    <div key={sub.id} className="p-4 bg-muted/20 border border-transparent hover:border-border rounded-2xl transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center font-bold text-slate-400 text-xs">
                                {sub.student?.user?.name?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-sm line-clamp-1">{sub.student?.user?.name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{sub.assignment?.title}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {sub.status === 'graded' ? (
                                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Graded</span>
                            ) : (
                                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Pending</span>
                            )}
                            <span className="text-[9px] text-muted-foreground">{new Date(sub.submitted_at).toLocaleDateString('ar-EG')}</span>
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

export default InstructorDashboard;
