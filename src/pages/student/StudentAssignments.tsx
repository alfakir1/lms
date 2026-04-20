import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAssignments, mockSubmissions, mockCourses } from '../../utils/mockData';

const StudentAssignments: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Find all assignments for courses the student is enrolled in
  // For simplicity in mock, we'll show all and match submissions
  const studentSubmissions = mockSubmissions.filter(s => s.student_id === user?.id);
  const assignments = mockAssignments.map(a => ({
    ...a,
    course: mockCourses.find(c => c.id === a.course_id),
    submission: studentSubmissions.find(s => s.assignment_id === a.id)
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 rtl:text-right">
          <h1 className="text-3xl font-bold dark:text-white mb-2">{t('assignments.title')}</h1>
          <p className="text-neutral-500 dark:text-neutral-400">{t('assignments.subtitle')}</p>
        </div>

        <div className="grid gap-6">
          {assignments.length > 0 ? (
            assignments.map((a) => (
              <div key={a.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-neutral-100 dark:border-slate-800 hover:border-primary-500 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 rtl:flex-row-reverse">
                  <div className="flex gap-6 items-start rtl:flex-row-reverse">
                    <div className={`p-4 rounded-2xl flex-shrink-0 ${
                      a.submission ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="rtl:text-right">
                      <h3 className="text-xl font-bold dark:text-white mb-1">{a.title}</h3>
                      <p className="text-sm font-bold text-primary-600 mb-3">{a.course?.title}</p>
                      <div className="flex flex-wrap gap-4 items-center rtl:justify-start">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest rtl:flex-row-reverse">
                          <Clock className="w-4 h-4" />
                          <span>{t('common.due')}: {a.due_date}</span>
                        </div>
                        {a.submission && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-widest rtl:flex-row-reverse">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t('common.grade')}: {a.submission.grade}/100</span>
                          </div>
                        )}
                        {!a.submission && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest rtl:flex-row-reverse">
                            <AlertCircle className="w-4 h-4" />
                            <span>{t('common.pending')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 rtl:justify-start">
                    <button className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
                      a.submission 
                      ? 'bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-400 cursor-default' 
                      : 'bg-primary-600 text-white hover:shadow-glow active:scale-95'
                    }`}>
                      {a.submission ? t('assignments.viewSubmission') : t('assignments.uploadSolution')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-800">
              <p className="text-neutral-500">{t('common.noData')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;