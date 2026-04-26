import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCourses } from '../../hooks/useCourses';
import { BookOpen, FileText, CheckCircle, Plus, Users, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const stats = [
    { name: 'كورساتي', value: statsData?.my_courses || 0, icon: BookOpen, color: 'bg-blue-500' },
    { name: 'إجمالي الطلاب', value: statsData?.total_students || 0, icon: Users, color: 'bg-indigo-500' },
    { name: 'المهام المعلقة', value: '0', icon: FileText, color: 'bg-amber-500' },
    { name: 'التقييم العام', value: '4.8/5', icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">أهلاً بك، أستاذ {user?.name}</h1>
          <p className="text-slate-500">إدارة الكورسات والطلاب والمهام من مكان واحد.</p>
        </div>
        <Link to="/courses" className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
          <Plus className="w-4 h-4" /> عرض كورساتي
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="text-white w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm">{stat.name}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">أحدث كورساتي</h2>
            <Layout className="text-slate-400 w-5 h-5" />
          </div>
          <div className="space-y-4">
            {courses?.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden">
                    <img src={`https://picsum.photos/seed/${course.id}/100/100`} alt="course" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.status}</p>
                  </div>
                </div>
                <Link to={`/courses/${course.id}`} className="text-primary text-sm font-semibold">إدارة</Link>
              </div>
            ))}
            {courses?.length === 0 && <p className="text-sm text-slate-500 text-center py-4">لا توجد كورسات مضافة بعد.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">تسليمات المهام الأخيرة</h2>
            <FileText className="text-slate-400 w-5 h-5" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 text-center py-4">لا توجد تسليمات جديدة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
