import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, FileText, Clock, Award, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCourses, mockEnrollments, mockAssignments, mockSubmissions } from '../../utils/mockData';
import { useTranslation } from 'react-i18next';

const CoursePlayer: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'lessons' | 'assignments' | 'details'>('lessons');

  const id = parseInt(courseId || '0');
  const course = mockCourses.find(c => c.id === id);
  const enrollment = mockEnrollments.find(e => e.course_id === id && e.student_id === user?.id);
  const assignments = mockAssignments.filter(a => a.course_id === id);
  const studentSubmissions = mockSubmissions.filter(s => s.student_id === user?.id);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-bold">{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-neutral-100 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between rtl:flex-row-reverse">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-bold hover:text-primary-600 transition-colors rtl:flex-row-reverse"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            <span className="hidden sm:inline">{t('common.backToDashboard')}</span>
          </Link>
          <div className="flex-1 text-center px-4">
            <h1 className="text-sm md:text-base font-bold dark:text-white line-clamp-1">{course.title}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-slate-800 px-3 py-1 rounded-full rtl:flex-row-reverse">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase dark:text-neutral-300">{t('common.active')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Player Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Placeholder */}
            <div className="aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl relative group border-8 border-neutral-100 dark:border-slate-800">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600/20 to-secondary-600/20">
                <button className="bg-white text-primary-600 p-8 rounded-full shadow-2xl transform transition-all group-hover:scale-110 active:scale-95">
                  <Play className="w-10 h-10 fill-current rtl:rotate-180" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/70 text-xs font-bold uppercase tracking-widest rtl:flex-row-reverse">
                <span>{t('player.module', 'Module')} 1: {t('player.gettingStarted', 'Getting Started')}</span>
                <span className="font-mono">04:25 / 12:40</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 dark:border-slate-800 rtl:flex-row-reverse">
              {(['lessons', 'assignments', 'details'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                  }`}
                >
                  {t(`student.tabs.${tab}`, tab)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* LESSONS TAB */}
              {activeTab === 'lessons' && (
                <div className="space-y-4">
                  {course.lessons.map((lesson, i) => (
                    <div
                      key={lesson.id}
                      className="group flex items-center gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 hover:border-primary-500 transition-all cursor-pointer rtl:flex-row-reverse"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-slate-800 flex items-center justify-center font-black text-neutral-400 group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 rtl:text-right">
                        <h4 className="font-bold dark:text-white group-hover:text-primary-600 transition-colors">{lesson.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">{t('player.video')} • 12:45m</p>
                      </div>
                      {i < 2 ? (
                        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                      ) : (
                        <Play className="w-6 h-6 text-neutral-300 group-hover:text-primary-500 transition-colors shrink-0 rtl:rotate-180" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ASSIGNMENTS TAB */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => {
                      const submission = studentSubmissions.find(s => s.assignment_id === assignment.id);
                      return (
                        <div key={assignment.id} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rtl:text-right">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rtl:flex-row-reverse">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 rtl:flex-row-reverse">
                                <FileText className="w-5 h-5 text-primary-600" />
                                <h4 className="font-bold text-xl dark:text-white">{assignment.title}</h4>
                              </div>
                              <p className="text-neutral-500 text-sm mb-4">{assignment.description}</p>
                              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-400 rtl:flex-row-reverse">
                                <span className="flex items-center gap-1 rtl:flex-row-reverse">
                                  <Clock className="w-3.5 h-3.5" /> {t('common.due')}: {assignment.due_date}
                                </span>
                                {submission && (
                                  <span className="text-green-500">{t('common.grade')}: {submission.grade}/100</span>
                                )}
                              </div>
                            </div>
                            <button
                              className={`px-6 py-3 rounded-2xl font-bold transition-all shrink-0 ${
                                submission
                                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 cursor-default'
                                  : 'bg-primary-600 text-white hover:opacity-90 active:scale-95'
                              }`}
                            >
                              {submission ? `✓ ${t('common.submitted')}` : t('student.uploadSolution')}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 text-neutral-500 italic">
                      {t('student.noAssignments')}
                    </div>
                  )}
                </div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-neutral-100 dark:border-slate-800 space-y-10 rtl:text-right">
                  <div>
                    <h4 className="text-2xl font-bold dark:text-white mb-4">{t('courseDetails.description')}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">{course.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4 rtl:flex-row-reverse">
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="rtl:text-right">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{t('courses.instructor')}</p>
                        <p className="font-bold dark:text-white">{course.instructor?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rtl:flex-row-reverse">
                      <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="rtl:text-right">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{t('student.enrolledOn')}</p>
                        <p className="font-bold dark:text-white">{enrollment?.enrolled_at || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 rtl:text-right">
              <h4 className="font-bold dark:text-white mb-6">{t('student.courseProgress')}</h4>
              <div className="flex items-center gap-6 mb-8 rtl:flex-row-reverse">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-neutral-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40"
                      className="stroke-primary-600 fill-none transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (enrollment?.progress || 0)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xl font-black dark:text-white">{enrollment?.progress || 0}%</span>
                </div>
                <div className="rtl:text-right">
                  <p className="text-sm font-bold dark:text-white leading-tight">{t('student.welcome')}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {t('student.lessons', { count: course.lessons.length })}
                  </p>
                </div>
              </div>
              <Link
                to="/student/dashboard"
                className="block w-full py-3 bg-neutral-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white dark:text-white rounded-2xl text-center text-sm font-bold transition-all"
              >
                {t('common.backToDashboard')}
              </Link>
            </div>

            {/* Course Includes */}
            <div className="space-y-4 rtl:text-right">
              <h4 className="font-bold dark:text-white px-2">{t('student.courseIncludes')}:</h4>
              {[
                { icon: <Clock className="w-4 h-4" />, text: `${course.duration} ${t('common.hours')}` },
                { icon: <FileText className="w-4 h-4" />, text: `${assignments.length} ${t('student.assignments')}` },
                { icon: <Award className="w-4 h-4" />, text: t('student.certificateCompletion') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 text-sm font-medium text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                  <div className="text-primary-600">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;