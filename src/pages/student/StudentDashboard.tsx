import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Play, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { getStudentData } from '../../utils/mockData';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const studentData = user ? getStudentData(user.id) : null;

  if (!studentData) {
    return <div className="p-8 text-center text-red-500">{t('common.noData')}</div>;
  }

  const enrollments = studentData.enrollments || [];
  const stats = {
    activeCourses: enrollments.length,
    completedCourses: enrollments.filter(e => e.progress === 100).length,
    averageProgress:
      enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length)
        : 0,
    certificates: enrollments.filter(e => e.progress === 100).length
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
              {t('student.hello')}, {studentData.name}! 👋
            </h1>
            <div className="flex items-center gap-2 mb-2 rtl:flex-row-reverse">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-black tracking-wider uppercase">
                {t('student.id')}: {studentData.student_id || 'N/A'}
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              {t('student.subtitle', { percent: stats.averageProgress })}
            </p>
          </div>
          <Link
            to="/courses"
            className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 rtl:flex-row-reverse"
          >
            <BookOpen className="w-5 h-5" />
            {t('home.exploreNew')}
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: t('student.activeCourses'), value: stats.activeCourses, icon: <BookOpen />, color: 'bg-blue-500' },
            { label: t('student.completed'), value: stats.completedCourses, icon: <CheckCircle />, color: 'bg-green-500' },
            { label: t('student.avgProgress'), value: `${stats.averageProgress}%`, icon: <TrendingUp />, color: 'bg-purple-500' },
            { label: t('student.certificates'), value: stats.certificates, icon: <Award />, color: 'bg-orange-500' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 flex items-center gap-4 rtl:flex-row-reverse"
            >
              <div className={`${stat.color} p-4 rounded-2xl text-white shrink-0`}>
                {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
              </div>
              <div className="rtl:text-right">
                <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-neutral-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Ongoing Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2 rtl:flex-row-reverse">
              <h2 className="text-2xl font-bold dark:text-white rtl:text-right">{t('student.ongoingLearning')}</h2>
              <Link to="/student/courses" className="text-primary-600 font-bold hover:underline">
                {t('student.viewAllCourses')}
              </Link>
            </div>

            {enrollments.length > 0 ? (
              enrollments.map(e => (
                <div
                  key={e.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 group hover:border-primary-500 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 rtl:flex-row-reverse">
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center text-white/50 shrink-0">
                      <BookOpen className="w-12 h-12" />
                    </div>
                    <div className="flex-1 rtl:text-right">
                      <h3 className="text-xl font-bold mb-1 dark:text-white">{e.course?.title}</h3>
                      <p className="text-neutral-500 text-sm mb-4">{e.course?.instructor?.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold rtl:flex-row-reverse">
                          <span className="text-neutral-400">{t('student.courseProgress')}</span>
                          <span className="text-primary-600">{e.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${e.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/student/courses/${e.course_id}/learn`}
                      className="bg-neutral-100 dark:bg-slate-800 dark:text-white p-4 rounded-2xl hover:bg-primary-600 hover:text-white transition-all group-hover:scale-105 rtl:rotate-180"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-neutral-50 dark:bg-slate-900 p-12 rounded-3xl text-center border-2 border-dashed border-neutral-200 dark:border-slate-800">
                <p className="text-neutral-500">{t('student.noCoursesYet')}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Certificates */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-6 dark:text-white rtl:text-right">{t('student.recentCertificates')}</h2>
              <div className="space-y-6">
                {enrollments.filter(e => e.progress === 100).length > 0 ? (
                  enrollments
                    .filter(e => e.progress === 100)
                    .map((e, i) => (
                      <div key={i} className="flex items-center gap-4 rtl:flex-row-reverse">
                        <div className="bg-orange-100 dark:bg-orange-500/20 p-3 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div className="rtl:text-right">
                          <p className="font-bold text-sm dark:text-white leading-tight">{e.course?.title}</p>
                          <p className="text-xs text-neutral-400 mt-1">Jan 2024</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-neutral-500 italic rtl:text-right">{t('student.noCertificatesYet')}</p>
                )}
              </div>
              <Link
                to="/student/certificates"
                className="block mt-8 text-center text-sm font-bold text-primary-600 hover:underline"
              >
                {t('student.viewAllCertificates')}
              </Link>
            </div>

            {/* Study Time */}
            <div className="bg-gradient-to-br from-secondary-600 to-primary-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 rtl:text-right">
                <Clock className="w-10 h-10 mb-4 opacity-50 rtl:ml-auto rtl:mr-0" />
                <h3 className="text-lg font-bold mb-1">{t('student.learningTime')}</h3>
                <p className="text-4xl font-black mb-4">42.5h</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;