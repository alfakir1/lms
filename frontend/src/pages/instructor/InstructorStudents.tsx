import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Award, 
  FileText, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  X,
  Printer,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { mockUsers } from '../../utils/mockData';

const InstructorStudents: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  const students = mockUsers.filter(u => 
    u.role === 'student' && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.student_id?.includes(searchTerm))
  );

  const openReport = (student: any) => {
    setSelectedStudent(student);
    setShowReport(true);
  };

  const handleIssueCertificate = () => {
    setIsIssuing(true);
    setTimeout(() => {
      setIsIssuing(false);
      alert(`Certificate issued and sent to ${selectedStudent.name}, Admin, and Reception!`);
      setShowReport(false);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Users className="text-primary-500" />
          {t('instructor.myStudents', 'My Students')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          {t('instructor.studentsSubtitle', 'Manage student progress, generate reports, and issue certificates')}
        </p>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder={t('instructor.searchStudents', 'Search by name or ID...')}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right">
            <thead className="bg-neutral-50 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">{t('student.name', 'Student')}</th>
                <th className="px-6 py-4 font-bold">{t('student.joined', 'Joined Date')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('student.progress', 'Progress')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 rtl:flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="rtl:text-right">
                        <p className="font-bold text-neutral-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-neutral-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {student.created_at}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-neutral-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary-500 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-xs font-bold text-neutral-500">75%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openReport(student)}
                      className="mx-auto flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <FileText size={16} />
                      {t('instructor.viewReport', 'Report & Certificate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report & Certificate Modal */}
      {showReport && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-neutral-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-primary-500" />
                Performance Report: {selectedStudent.name}
              </h3>
              <button onClick={() => setShowReport(false)} className="text-neutral-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Attendance</p>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-300">92%</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Progress</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">75%</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Assignments</p>
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-300">8/10</p>
                </div>
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">GPA</p>
                  <p className="text-2xl font-black text-primary-700 dark:text-primary-300">3.8</p>
                </div>
              </div>

              {/* Detailed Grades */}
              <div className="space-y-4">
                <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Examination Scores
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-slate-800 rounded-xl">
                    <span className="font-medium">Quizzes Average</span>
                    <span className="font-bold text-primary-600">88/100</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-slate-800 rounded-xl">
                    <span className="font-medium">Mid-Term Exam</span>
                    <span className="font-bold text-primary-600">92/100</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-slate-800 rounded-xl">
                    <span className="font-medium">Final Exam</span>
                    <span className="font-bold text-primary-600">85/100</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-100 dark:border-slate-800">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-all"
                >
                  <Printer size={18} />
                  Print Report
                </button>
                <button 
                  onClick={handleIssueCertificate}
                  disabled={isIssuing}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50"
                >
                  {isIssuing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Award size={18} />
                  )}
                  Issue & Send Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;