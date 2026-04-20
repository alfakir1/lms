import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { getInstructorData, mockSubmissions, mockUsers } from '../../utils/mockData';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const instructorData = user ? getInstructorData(user.id) : null;

  if (!instructorData) {
    return <div className="p-8 text-center text-red-500 font-bold">{t('common.error', 'Error: Instructor data not found.')}</div>;
  }

  const courses = instructorData.courses || [];
  const stats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((acc, curr) => acc + curr.enrollments.length, 0),
    pendingAssignments: 5,
    averageRating: 4.8
  };

  const recentSubmissions = mockSubmissions.slice(0, 3).map(s => ({
    ...s,
    student: mockUsers.find(u => u.id === s.student_id)
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-4xl font-extrabold dark:text-white tracking-tight mb-2">
              {t('instructor.dashboardTitle')}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">{t('instructor.subtitle')}</p>
          </div>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 rtl:flex-row-reverse">
            <Plus className="w-5 h-5" />
            {t('instructor.createNewCourse')}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: t('instructor.totalCourses'), value: stats.totalCourses, icon: BookOpen, color: 'bg-blue-500' },
            { label: t('instructor.totalStudents'), value: stats.totalStudents, icon: Users, color: 'bg-indigo-500' },
            { label: t('instructor.pendingGrading'), value: stats.pendingAssignments, icon: FileText, color: 'bg-orange-500' },
            { label: t('instructor.averageRating'), value: stats.averageRating, icon: TrendingUp, color: 'bg-green-500' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 flex items-center gap-4 rtl:flex-row-reverse"
            >
              <div className={`${stat.color} p-4 rounded-2xl text-white`}>
                <stat.icon className="w-6 h-6" />
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
          {/* My Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <h2 className="text-2xl font-bold dark:text-white">{t('instructor.myCourses')}</h2>
              <Link to="/instructor/courses" className="text-primary-600 font-bold hover:underline">
                {t('instructor.manageAll')}
              </Link>
            </div>

            <div className="grid gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse"
                >
                  <div className="flex items-center gap-4 rtl:flex-row-reverse">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary-600 flex-shrink-0">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="rtl:text-right">
                      <h3 className="font-bold dark:text-white">{course.title}</h3>
                      <p className="text-sm text-neutral-500">
                        {course.enrollments.length} {t('instructor.studentsEnrolled')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rtl:flex-row-reverse">
                    <Link
                      to={`/instructor/courses/${course.id}/lessons`}
                      className="px-4 py-2 bg-neutral-100 dark:bg-slate-800 dark:text-white rounded-xl text-sm font-bold hover:bg-primary-600 hover:text-white transition-all"
                    >
                      {t('instructor.edit')}
                    </Link>
                    <Link
                      to="/instructor/students"
                      className="px-4 py-2 bg-neutral-100 dark:bg-slate-800 dark:text-white rounded-xl text-sm font-bold hover:bg-secondary-600 hover:text-white transition-all"
                    >
                      {t('instructor.students')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-10">
            {/* Recent Submissions */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-6 dark:text-white rtl:text-right">{t('instructor.recentSubmissions')}</h2>
              <div className="space-y-6">
                {recentSubmissions.map((sub, i) => (
                  <div key={i} className="flex items-center gap-4 rtl:flex-row-reverse">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                      {sub.student?.name.charAt(0)}
                    </div>
                    <div className="flex-1 rtl:text-right">
                      <p className="font-bold text-sm dark:text-white">{sub.student?.name}</p>
                      <p className="text-xs text-neutral-400">{t('common.assignment', 'Assignment')} #{sub.assignment_id}</p>
                    </div>
                    <button className="text-xs font-bold text-primary-600 hover:underline">
                      {t('instructor.manage')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Teaser */}
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-lg rtl:text-right">
              <TrendingUp className="w-10 h-10 mb-4 opacity-50 rtl:mr-auto rtl:ml-0" />
              <h3 className="text-lg font-bold mb-2">{t('instructor.performanceInsight')}</h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-6">{t('instructor.engagementUp')}</p>
              <Link
                to="/instructor/analytics"
                className="inline-block px-6 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all"
              >
                {t('instructor.fullAnalytics')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;