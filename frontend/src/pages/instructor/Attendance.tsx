import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Save, Users, Calendar, Search } from 'lucide-react';
import { mockUsers } from '../../utils/mockData';

const Attendance: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Filter students
  const students = mockUsers.filter(u => 
    u.role === 'student' && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.student_id?.includes(searchTerm))
  );

  const toggleAttendance = (id: number) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Attendance saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-primary-500" />
            {t('instructor.attendanceTitle', 'Daily Attendance')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          <Save size={20} />
          {t('common.save', 'Save Attendance')}
        </button>
      </header>

      {saveStatus && (
        <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl animate-in slide-in-from-top-2">
          {saveStatus}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-neutral-50 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder={t('common.search', 'Search by name or ID...')}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right">
            <thead className="bg-neutral-50 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-bold">{t('student.id', 'Student ID')}</th>
                <th className="px-6 py-4 font-bold">{t('student.name', 'Student Name')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('common.status', 'Attendance Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-neutral-500">{student.student_id || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">{student.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => toggleAttendance(student.id)}
                        className={`p-3 rounded-full transition-all ${attendance[student.id] ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-400'}`}
                        title="Present"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => setAttendance(prev => ({ ...prev, [student.id]: false }))}
                        className={`p-3 rounded-full transition-all ${attendance[student.id] === false ? 'bg-red-500 text-white shadow-red-200' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-400'}`}
                        title="Absent"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
