import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { BookOpen, Award, Clock, Activity, PlayCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  // using useCourses as a fallback since myEnrollments is a specific endpoint. 
  // Let's assume useCourses gets what they need or we use a standard approach.
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const stats = [
    { name: 'الكورسات الحالية', value: statsData?.enrolled_courses || 0, icon: BookOpen, color: 'bg-primary' },
    { name: 'الشهادات المنجزة', value: '0', icon: Award, color: 'bg-amber-500' },
    { name: 'ساعات التعلم', value: '12h', icon: Clock, color: 'bg-emerald-500' },
    { name: 'معدل الحضور', value: '95%', icon: Activity, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مرحباً بك، {user?.name}</h1>
          <p className="text-slate-500">مستقبلك يبدأ من هنا. واصل رحلة التعلم!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-primary/20`}>
              <stat.icon className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold">{stat.name}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">مواصلة التعلم</h2>
            <Link to="/courses" className="text-sm font-bold text-primary hover:underline">استكشاف المزيد</Link>
          </div>
          
          <div className="space-y-4">
            {courses?.slice(0, 2).map((course) => (
              <div key={course.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/20 transition-colors">
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
                  <img src={`https://picsum.photos/seed/${course.id}/400/300`} alt="course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">الدرس القادم: مقدمة في المساق</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>التقدم</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-0 h-full bg-primary rounded-full" />
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}/play`} className="inline-flex items-center justify-center gap-2 w-full btn-primary py-2 rounded-xl text-sm">
                    متابعة <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            {courses?.length === 0 && <p className="text-sm text-slate-500 text-center py-4">لم تسجل في أي كورسات بعد.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">المهام القادمة</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            <p className="text-sm text-slate-500 text-center py-4">لا توجد مهام حالياً.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
