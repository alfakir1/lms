import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Clock, Users, Search, ChevronRight, X,
  CalendarDays, CheckCircle2, XCircle, UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCourses } from '../../utils/mockData';

const MAX_CAPACITY = 30;

const CoursesView: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const filtered = mockCourses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.viewCourses', 'Available Courses')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.viewCoursesSubtitle', 'Click any course to view full details and availability')}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-2xl outline-none text-sm w-64 shadow-soft focus:ring-2 focus:ring-primary-500 transition-all"
            placeholder="Search courses..."
          />
        </div>
      </header>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((course) => {
          const enrolled = course.enrollments.length;
          const seatsLeft = MAX_CAPACITY - enrolled;
          const hasSpace = seatsLeft > 0;
          return (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden hover:shadow-glow-sm transition-all group cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-40 h-36 md:h-auto bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center p-6 shrink-0">
                  <BookOpen size={48} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-black shrink-0 ml-2">
                      {course.price} SAR
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-blue-500" />
                      <span>{enrolled}/{MAX_CAPACITY} students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-indigo-500" />
                      <span>Starts: 2024-05-01</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${hasSpace ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className={hasSpace ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                        {hasSpace ? `${seatsLeft} seats left` : 'Full'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${hasSpace ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {hasSpace ? <span className="flex items-center gap-1"><CheckCircle2 size={11} /> Open</span> : <span className="flex items-center gap-1"><XCircle size={11} /> Full</span>}
                    </span>
                    <button className="text-primary-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-100 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black">{selectedCourse.title}</h2>
                  <p className="text-primary-100 text-sm mt-1">{selectedCourse.description}</p>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors ml-4 flex-shrink-0">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Enrolled</p>
                  <p className="text-3xl font-black text-blue-700 dark:text-blue-300">
                    {selectedCourse.enrollments.length}
                    <span className="text-sm font-normal text-blue-500">/{MAX_CAPACITY}</span>
                  </p>
                </div>
                <div className={`rounded-2xl p-4 ${MAX_CAPACITY - selectedCourse.enrollments.length > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <p className={`text-xs font-bold uppercase mb-1 ${MAX_CAPACITY - selectedCourse.enrollments.length > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    Available Seats
                  </p>
                  <p className={`text-3xl font-black ${MAX_CAPACITY - selectedCourse.enrollments.length > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                    {MAX_CAPACITY - selectedCourse.enrollments.length}
                  </p>
                </div>
              </div>

              {/* Course Info Rows */}
              <div className="space-y-3 bg-neutral-50 dark:bg-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><Clock size={14} /> Duration</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedCourse.duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><CalendarDays size={14} /> Start Date</span>
                  <span className="font-bold text-neutral-900 dark:text-white">2024-05-01</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><BookOpen size={14} /> Lessons</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedCourse.lessons?.length || 0} lessons</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Price</span>
                  <span className="font-black text-emerald-600 text-base">{selectedCourse.price} SAR</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                  <span>Enrollment Capacity</span>
                  <span>{Math.round((selectedCourse.enrollments.length / MAX_CAPACITY) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${selectedCourse.enrollments.length >= MAX_CAPACITY ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((selectedCourse.enrollments.length / MAX_CAPACITY) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedCourse(null)} className="flex-1 py-3 bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 rounded-2xl font-bold hover:bg-neutral-200 transition-all">
                  Close
                </button>
                {MAX_CAPACITY - selectedCourse.enrollments.length > 0 && (
                  <Link
                    to="/reception/register"
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 transition-all"
                  >
                    <UserPlus size={16} />
                    Register Student
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesView;
