import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentData } from '../../utils/mockData';
import { useTranslation } from 'react-i18next';

const MyCourses: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const studentData = user ? getStudentData(user.id) : null;
  const enrollments = studentData?.enrollments || [];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('student.myEnrolledCourses')}</h1>
            <p className="text-neutral-500 dark:text-neutral-400">{t('student.continueSubtitle', 'Continue where you left off or start a new lesson.')}</p>
          </div>
          
          <div className="flex gap-4 rtl:flex-row-reverse">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder={t('student.searchMyCourses')} 
                className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white rtl:text-right"
              />
            </div>
            <button className="p-2 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-all">
              <Filter className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.length > 0 ? (
            enrollments.map((e) => (
              <div key={e.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-soft border border-neutral-100 dark:border-slate-800 flex flex-col h-full hover:shadow-lg transition-all group rtl:text-right">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-600 relative">
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {t('common.enrolled')}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40">
                    <Link 
                      to={`/student/courses/${e.course_id}/learn`}
                      className="bg-white text-primary-600 p-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                    >
                      <Play className="w-6 h-6 fill-current rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 dark:text-white line-clamp-1">{e.course?.title}</h3>
                  <p className="text-sm text-neutral-500 mb-6">{t('courses.instructor')}: {e.course?.instructor?.name}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1 rtl:flex-row-reverse">
                      <span className="text-neutral-400">{t('student.progress')}</span>
                      <span className="text-primary-600">{e.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-50 dark:border-slate-800 mt-4 rtl:flex-row-reverse">
                      <span className="text-sm font-medium text-neutral-500">12/24 {t('student.lessons', 'Lessons')}</span>
                      <Link 
                        to={`/student/courses/${e.course_id}/learn`}
                        className="text-primary-600 font-bold text-sm hover:underline"
                      >
                        {t('student.resumeCourse')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-neutral-100 dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold dark:text-white mb-2">{t('common.noData')}</h2>
              <p className="text-neutral-500 mb-8">{t('student.noCoursesYet')}</p>
              <Link to="/courses" className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-glow transition-all">
                {t('student.browseCourseCatalog')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;