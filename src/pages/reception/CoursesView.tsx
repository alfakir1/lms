import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Tag,
  Search,
  ChevronRight
} from 'lucide-react';
import { mockCourses } from '../../utils/mockData';

const CoursesView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rtl:flex-row-reverse">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.viewCourses')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.viewCoursesSubtitle', 'Reference for course details, pricing, and availability.')}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-2xl outline-none text-sm w-64 shadow-soft focus:ring-2 focus:ring-primary-500 transition-all rtl:text-right"
            placeholder={t('courses.search')}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden hover:shadow-glow-sm transition-all group flex flex-col md:flex-row rtl:md:flex-row-reverse"
          >
            <div className="md:w-48 h-48 md:h-auto bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center p-6 relative overflow-hidden shrink-0">
              <BookOpen size={48} className="text-primary-600 dark:text-primary-400 relative z-10" />
              <div className="absolute -right-4 -bottom-4 opacity-5 scale-150 rotate-12 rtl:right-auto rtl:-left-4 rtl:-rotate-12">
                <BookOpen size={100} />
              </div>
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start mb-4 rtl:flex-row-reverse">
                <div className="rtl:text-right">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-black shrink-0">
                  {t('common.currency', { val: course.price })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 rtl:text-right">
                <div className="flex items-center gap-2 rtl:flex-row-reverse text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse text-xs text-neutral-500 dark:text-neutral-400">
                  <Users size={14} className="text-blue-500 shrink-0" />
                  <span>{course.enrollments.length} {t('common.students')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-50 dark:border-slate-800 rtl:flex-row-reverse">
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <Tag size={14} className="text-indigo-500" />
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('common.active')}</span>
                </div>
                <button className="text-primary-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all rtl:flex-row-reverse">
                  {t('courses.viewDetails')}
                  <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesView;
