import React, { useState } from 'react';
import { Users, Mail, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockEnrollments, mockCourses } from '../../utils/mockData';
import { useTranslation } from 'react-i18next';

const InstructorStudents: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Find students enrolled in this instructor's courses
  const instructorCourses = mockCourses.filter(c => c.instructor_id === user?.id);
  const courseIds = instructorCourses.map(c => c.id);
  const relevantEnrollments = mockEnrollments.filter(e => courseIds.includes(e.course_id));
  const studentIds = Array.from(new Set(relevantEnrollments.map(e => e.student_id)));
  
  const students = studentIds.map(id => {
    const s = mockUsers.find(u => u.id === id);
    const sEnrollments = relevantEnrollments.filter(e => e.student_id === id);
    return {
      ...s,
      enrollments: sEnrollments.map(e => ({
        ...e,
        course: instructorCourses.find(c => c.id === e.course_id)
      }))
    };
  }).filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('instructor.myStudents', 'My Students')}</h1>
            <p className="text-neutral-500 dark:text-neutral-400">{t('instructor.studentsSubtitle', 'Manage and track student progress across your courses.')}</p>
          </div>
          
          <div className="flex gap-4 rtl:flex-row-reverse">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder={t('student.searchStudents', 'Search students...')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white rtl:text-right"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-soft border border-neutral-100 dark:border-slate-800 rtl:text-right">
                <div className="flex flex-col lg:flex-row gap-8 rtl:flex-row-reverse">
                  <div className="flex items-center gap-6 rtl:flex-row-reverse">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-2xl font-black text-white shrink-0">
                      {student.name?.charAt(0)}
                    </div>
                    <div className="rtl:text-right">
                      <h3 className="text-2xl font-bold dark:text-white mb-1">{student.name}</h3>
                      <p className="text-neutral-500 text-sm mb-4">{student.email}</p>
                      <div className="flex gap-3 rtl:flex-row-reverse">
                        <button className="p-2 bg-neutral-100 dark:bg-slate-800 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                          <Mail className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-neutral-100 dark:bg-slate-800 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 lg:border-l lg:dark:border-slate-800 lg:pl-8 rtl:lg:border-l-0 rtl:lg:border-r rtl:lg:pl-0 rtl:lg:pr-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">{t('student.enrollments', 'Enrollments')}</h4>
                    <div className="space-y-4">
                      {student.enrollments.map((e, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 rtl:flex-row-reverse">
                          <div className="flex-1 rtl:text-right">
                            <p className="text-sm font-bold dark:text-white mb-1">{e.course?.title}</p>
                            <div className="w-full bg-neutral-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-primary-500 h-full" style={{ width: `${e.progress}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-primary-600 shrink-0">{e.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end rtl:items-start gap-2">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('student.enrolledOn', 'Enrolled On')}</p>
                    <p className="font-bold dark:text-white">{student.created_at}</p>
                    <button className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-soft hover:shadow-glow transition-all">
                      {t('instructor.viewPortfolio', 'View Portfolio')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-neutral-100 dark:border-slate-800">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 font-bold">{t('common.noData', 'No data')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorStudents;