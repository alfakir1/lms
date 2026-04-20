import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, User, MessageCircle, Download } from 'lucide-react';

const InstructorAssignments: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Build a Responsive Landing Page',
      course: 'Web Development Fundamentals',
      student: 'John Doe',
      studentEmail: 'john@example.com',
      submittedDate: '2024-01-18',
      dueDate: '2024-01-20',
      status: 'pending',
      grade: null,
      feedback: '',
      submissionContent: 'Submitted a complete landing page with HTML, CSS, and JavaScript. Includes responsive design and modern UI elements.',
      attachments: ['landing-page.zip', 'screenshots.pdf']
    },
    {
      id: 2,
      title: 'React Component Exercise',
      course: 'React for Beginners',
      student: 'Jane Smith',
      studentEmail: 'jane@example.com',
      submittedDate: '2024-01-17',
      dueDate: '2024-01-25',
      status: 'graded',
      grade: 'A-',
      feedback: 'Excellent work! Your component demonstrates good understanding of React hooks and state management. Minor improvements needed in error handling.',
      submissionContent: 'Created a reusable form component with validation and state management.',
      attachments: ['react-component.js', 'readme.md']
    },
    {
      id: 3,
      title: 'Database Design Project',
      course: 'Python Programming',
      student: 'Mike Johnson',
      studentEmail: 'mike@example.com',
      submittedDate: '2024-01-16',
      dueDate: '2024-01-15',
      status: 'overdue',
      grade: null,
      feedback: '',
      submissionContent: 'Late submission - Database schema design for library management system.',
      attachments: ['schema.sql', 'erd-diagram.png']
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-400';
    }
  };

  const isOverdue = (dueDate: string, submittedDate: string) => {
    return new Date(submittedDate) > new Date(dueDate);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 rtl:text-right">
          <h1 className="text-3xl font-bold text-text dark:text-white mb-2">{t('instructor.gradeAssignments', 'Grade Assignments')}</h1>
          <p className="text-gray-600 dark:text-slate-400">{t('instructor.gradeAssignmentsSubtitle', 'Review and grade student submissions')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="text-2xl font-bold text-primary mb-2">{assignments.length}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('instructor.totalSubmissions', 'Total Submissions')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('instructor.pendingGrading', 'Pending Review')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {assignments.filter(a => a.status === 'graded').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('common.graded', 'Graded')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {assignments.filter(a => a.status === 'overdue').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('common.overdue', 'Overdue')}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 mb-8 border border-neutral-100 dark:border-slate-800">
          <div className="flex items-center space-x-4 rtl:space-x-reverse rtl:flex-row-reverse">
            <span className="text-sm font-bold text-text dark:text-white shrink-0">{t('common.filterBy', 'Filter by status')}:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none rtl:text-right"
            >
              <option value="all">{t('common.all')}</option>
              <option value="pending">{t('instructor.pendingGrading')}</option>
              <option value="graded">{t('common.graded')}</option>
              <option value="overdue">{t('common.overdue')}</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 border border-neutral-100 dark:border-slate-800">
              <div className="flex items-start justify-between mb-4 rtl:flex-row-reverse">
                <div className="flex-1 rtl:text-right">
                  <div className="flex flex-wrap items-center gap-3 mb-2 rtl:flex-row-reverse">
                    <h3 className="text-xl font-bold text-primary dark:text-secondary">{assignment.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(assignment.status)}`}>
                      {t(`common.${assignment.status}`, assignment.status)}
                    </span>
                    {isOverdue(assignment.dueDate, assignment.submittedDate) && (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        {t('instructor.lateSubmission', 'Late Submission')}
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3 rtl:text-right">
                    <div>
                      <p className="text-text dark:text-slate-300 mb-1">
                        <span className="font-bold">{t('common.course')}:</span> {assignment.course}
                      </p>
                      <p className="text-text dark:text-slate-300 mb-1">
                        <span className="font-bold">{t('common.student')}:</span> {assignment.student}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{assignment.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                        <span className="font-bold">{t('common.submitted', 'Submitted')}:</span> {assignment.submittedDate}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                        <span className="font-bold">{t('common.due')}:</span> {assignment.dueDate}
                      </p>
                      {assignment.grade && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          <span className="font-bold">{t('common.grade')}:</span> {assignment.grade}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-6 mb-6">
                <h4 className="font-bold text-text dark:text-white mb-3 rtl:text-right">{t('common.submission', 'Submission')}</h4>
                <p className="text-text dark:text-slate-300 mb-4 rtl:text-right">{assignment.submissionContent}</p>

                {assignment.attachments.length > 0 && (
                  <div className="mb-4 rtl:text-right">
                    <p className="text-sm font-bold text-text dark:text-white mb-2">{t('instructor.attachments', 'Attachments')}:</p>
                    <div className="flex flex-wrap gap-2 rtl:flex-row-reverse">
                      {assignment.attachments.map((file, index) => (
                        <button
                          key={index}
                          className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm transition-all dark:text-white font-medium"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{file}</span>
                          <Download className="h-4 w-4 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {assignment.feedback && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-6 rtl:text-right">
                  <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">{t('instructor.yourFeedback', 'Your Feedback')}</h4>
                  <p className="text-blue-800 dark:text-blue-300">{assignment.feedback}</p>
                </div>
              )}

              {/* Grading Form */}
              {assignment.status === 'pending' && (
                <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-text dark:text-white mb-6 rtl:text-right">{t('instructor.gradeAssignment', 'Grade Assignment')}</h4>
                  <div className="grid md:grid-cols-2 gap-6 mb-6 rtl:text-right">
                    <div>
                      <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('common.grade')}</label>
                      <select className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none rtl:text-right">
                        <option value="">{t('instructor.selectGrade', 'Select grade')}</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('instructor.quickActions', 'Quick Actions')}</label>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-bold">
                          {t('common.approve')}
                        </button>
                        <button className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-xl hover:bg-yellow-700 transition-colors text-sm font-bold">
                          {t('instructor.needsRevision', 'Needs Revision')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 rtl:text-right">
                    <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('instructor.feedback')}</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none rtl:text-right"
                      placeholder={t('instructor.feedbackPlaceholder', 'Provide detailed feedback for the student...')}
                    ></textarea>
                  </div>

                  <div className="flex space-x-3 rtl:space-x-reverse rtl:flex-row-reverse">
                    <button className="bg-secondary text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold">
                      {t('instructor.submitGrade', 'Submit Grade')}
                    </button>
                    <button className="border border-gray-300 dark:border-slate-700 text-text dark:text-white px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold">
                      {t('common.saveDraft', 'Save Draft')}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-slate-800 mt-6 rtl:flex-row-reverse">
                <div className="flex space-x-4 rtl:space-x-reverse rtl:flex-row-reverse">
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-secondary hover:text-primary text-sm font-bold transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{t('instructor.messageStudent', 'Message Student')}</span>
                  </button>
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-secondary hover:text-primary text-sm font-bold transition-colors">
                    <User className="h-4 w-4" />
                    <span>{t('instructor.viewProfile', 'View Profile')}</span>
                  </button>
                </div>

                {assignment.status === 'graded' && (
                  <button className="text-secondary hover:text-primary text-sm font-bold transition-colors">
                    {t('instructor.editGrade', 'Edit Grade')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Assignments */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text dark:text-white mb-2">{t('common.noData')}</h3>
            <p className="text-gray-600 dark:text-slate-400">{t('common.tryAdjustingFilter', 'Try adjusting your filter criteria.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorAssignments;