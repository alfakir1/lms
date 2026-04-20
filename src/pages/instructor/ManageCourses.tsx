import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, DollarSign, Trash2, Plus, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getInstructorData } from '../../utils/mockData';
import { useTranslation } from 'react-i18next';

const ManageCourses: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const instructorData = user ? getInstructorData(user.id) : null;
  const courses = instructorData?.courses || [];
  
  const [filter] = useState('all');

  const filteredCourses = courses.filter(_course => {
    if (filter === 'all') return true;
    return filter === 'published'; // In mock, all are published for now
  });

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrollments?.length || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * (c.enrollments?.length || 0)), 0);

  const stats = [
    { label: t('admin.totalCourses', 'Total Courses'), value: courses.length, icon: <BookOpen />, color: 'bg-blue-500' },
    { label: t('admin.totalStudents', 'Total Students'), value: totalStudents, icon: <Users />, color: 'bg-green-500' },
    { label: t('admin.totalRevenue', 'Total Revenue'), value: String(t('common.currency', { val: totalRevenue })), icon: <DollarSign />, color: 'bg-purple-500' },
    { label: t('courses.avgRating', 'Avg. Rating'), value: '4.8', icon: <Star />, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('instructor.manageCourses', 'Manage Courses')}</h1>
            <p className="text-neutral-500 dark:text-neutral-400">{t('instructor.manageSubtitle', 'View and edit your course curriculum and settings.')}</p>
          </div>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 rtl:flex-row-reverse">
            <Plus className="w-5 h-5 shrink-0" />
            <span>{t('instructor.createNewCourse', 'Create New Course')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 rtl:text-right">
              <div className="flex items-center gap-4 rtl:flex-row-reverse">
                <div className={`${stat.color} p-3 rounded-xl text-white shrink-0`}>
                  {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
                </div>
                <div className="rtl:text-right overflow-hidden">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest truncate">{stat.label}</p>
                  <p className="text-xl font-black dark:text-white truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-soft border border-neutral-100 dark:border-slate-800 hover:border-primary-500 transition-all group rtl:text-right">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 rtl:flex-row-reverse">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 rtl:flex-row-reverse">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">{t('common.active', 'Active')}</span>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{course.duration}</span>
                    </div>
                    <h3 className="text-2xl font-bold dark:text-white mb-2">{course.title}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-6">{course.description}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm font-bold rtl:flex-row-reverse">
                      <div className="flex items-center gap-2 dark:text-neutral-300 rtl:flex-row-reverse">
                        <Users className="w-4 h-4 text-primary-600 shrink-0" />
                        <span>{(course.enrollments?.length || 0)} {t('common.students')}</span>
                      </div>
                      <div className="flex items-center gap-2 dark:text-neutral-300 rtl:flex-row-reverse">
                        <DollarSign className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{String(t('common.currency', { val: (course.price * (course.enrollments?.length || 0)) }))} {t('instructor.earned', 'Earned')}</span>
                      </div>
                      <div className="flex items-center gap-2 dark:text-neutral-300 rtl:flex-row-reverse">
                        <Star className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>4.8 {t('courses.avgRating')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-nowrap gap-3 rtl:flex-row-reverse">
                    <Link to={`/instructor/courses/${course.id}/lessons`} className="flex-1 lg:flex-none px-6 py-3 bg-neutral-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-sm hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center gap-2 rtl:flex-row-reverse">
                      <Settings className="w-4 h-4" />
                      <span>{t('instructor.manage', 'Manage')}</span>
                    </Link>
                    <Link to={`/instructor/courses/${course.id}/students`} className="flex-1 lg:flex-none px-6 py-3 bg-neutral-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold text-sm hover:bg-secondary-600 hover:text-white transition-all flex items-center justify-center gap-2 rtl:flex-row-reverse">
                      <Users className="w-4 h-4" />
                      <span>{t('common.students')}</span>
                    </Link>
                    <button className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-neutral-100 dark:border-slate-800">
              <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 font-bold">{t('common.noData', 'No data')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;