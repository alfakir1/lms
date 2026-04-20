import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar,
  ChevronRight,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { mockUsers } from '../../utils/mockData';

const StudentsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const students = mockUsers.filter(u => 
    u.role === 'student' && 
    ((u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (u.student_id && u.student_id.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rtl:flex-row-reverse">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.studentManagement')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.managementSubtitle')}
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-neutral-100 dark:border-slate-800 shadow-soft rtl:flex-row-reverse">
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 bg-transparent outline-none text-sm w-64 rtl:text-right"
              placeholder={t('admin.searchUsers')}
            />
          </div>
          <button className="p-2 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Filter size={18} className="text-neutral-500" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {students.map((student) => (
          <div 
            key={student.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-neutral-100 dark:border-slate-800 shadow-soft hover:shadow-glow-sm transition-all group rtl:text-right"
          >
            <div className="flex items-start justify-between mb-6 rtl:flex-row-reverse">
              <div className="flex items-center gap-4 rtl:flex-row-reverse">
                <div className="w-16 h-16 rounded-3xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-2xl shadow-inner shrink-0">
                  {student.name?.charAt(0)}
                </div>
                <div className="rtl:text-right">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 rtl:flex-row-reverse">
                    <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded font-bold">
                      {student.student_id || 'NO ID'}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <UserCheck size={12} className="text-emerald-500" />
                    {t('common.studentAccount')}
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <MoreVertical size={20} className="text-neutral-400" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <Mail size={16} className="text-primary-500 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <Calendar size={16} className="text-indigo-500 shrink-0" />
                <span>{t('common.joined')} {new Date(student.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <GraduationCap size={16} className="text-amber-500 shrink-0" />
                <span>2 {t('student.enrollments')}</span>
              </div>
            </div>

            <div className="flex gap-2 rtl:flex-row-reverse">
              <button className="flex-1 py-3 bg-neutral-50 dark:bg-slate-800 hover:bg-primary-600 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 rtl:flex-row-reverse">
                {t('common.viewProfile')}
                <ChevronRight size={14} className="rtl:rotate-180" />
              </button>
              <button className="px-4 py-3 bg-neutral-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl text-xs font-bold transition-all">
                {t('common.enrolled')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsManagement;
