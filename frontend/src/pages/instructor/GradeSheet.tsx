import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Send, Search, Calculator, FileSpreadsheet } from 'lucide-react';
import { mockUsers } from '../../utils/mockData';

const GradeSheet: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState<Record<number, any>>({});
  const [status, setStatus] = useState<string | null>(null);

  const students = mockUsers.filter(u => u.role === 'student');

  const updateGrade = (studentId: number, field: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setStatus('Saving grades...');
    setTimeout(() => {
      setStatus('Grades saved locally.');
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  const handleSendToStudent = (student: any) => {
    alert(`Sent grades to ${student.name} via notification and email.`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="text-primary-500" />
            {t('instructor.gradeSheetTitle', 'Grade Management Sheet')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('instructor.gradeSheetSubtitle', 'Enter and manage grades for Quizzes, Midterm, and Final exams')}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
          >
            <Save size={20} />
            {t('common.saveAll', 'Save All')}
          </button>
        </div>
      </header>

      {status && (
        <div className="bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-xl">
          {status}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right">
            <thead className="bg-neutral-50 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">{t('student.name', 'Student')}</th>
                <th className="px-6 py-4 font-bold text-center">Assignments</th>
                <th className="px-6 py-4 font-bold text-center">Quizzes</th>
                <th className="px-6 py-4 font-bold text-center">Mid-Term</th>
                <th className="px-6 py-4 font-bold text-center">Final Exam</th>
                <th className="px-6 py-4 font-bold text-center">Total</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
              {students.map(student => {
                const sGrades = grades[student.id] || { ass: '', quiz: '', mid: '', final: '' };
                const total = (Number(sGrades.ass) || 0) + (Number(sGrades.quiz) || 0) + (Number(sGrades.mid) || 0) + (Number(sGrades.final) || 0);
                
                return (
                  <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-neutral-900 dark:text-white">{student.name}</p>
                      <p className="text-xs text-neutral-500">{student.student_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-16 mx-auto text-center py-2 bg-neutral-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 block"
                        value={sGrades.ass}
                        onChange={(e) => updateGrade(student.id, 'ass', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-16 mx-auto text-center py-2 bg-neutral-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 block"
                        value={sGrades.quiz}
                        onChange={(e) => updateGrade(student.id, 'quiz', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-16 mx-auto text-center py-2 bg-neutral-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 block"
                        value={sGrades.mid}
                        onChange={(e) => updateGrade(student.id, 'mid', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-16 mx-auto text-center py-2 bg-neutral-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 block"
                        value={sGrades.final}
                        onChange={(e) => updateGrade(student.id, 'final', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-black text-lg ${total >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {total}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleSendToStudent(student)}
                        className="mx-auto flex items-center justify-center p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-all"
                        title="Send grades to student"
                      >
                        <Send size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeSheet;
