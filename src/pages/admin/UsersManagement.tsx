import React, { useState } from 'react';
import { Search, Edit, Trash2, Shield, UserCheck, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockUsers } from '../../utils/mockData';

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { t } = useTranslation();

  const filteredUsers = mockUsers.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('admin.userManagement', 'User Management')}</h1>
            <p className="text-neutral-500 dark:text-neutral-400">{t('admin.userManagementSubtitle', 'Manage user accounts and permissions')}</p>
          </div>
          
          <div className="flex gap-4 rtl:flex-row-reverse">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder={t('admin.searchUsers', 'Search users...')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white rtl:text-right"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white text-sm font-bold rtl:text-right"
            >
              <option value="all">{t('admin.allRoles', 'All Roles')}</option>
              <option value="student">{t('common.student')}</option>
              <option value="instructor">{t('common.instructor')}</option>
              <option value="reception">{t('common.reception')}</option>
              <option value="admin">{t('common.admin')}</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-neutral-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-neutral-50 dark:bg-slate-800/50 border-b border-neutral-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-neutral-400">{t('common.name', 'Name')}</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-neutral-400">{t('auth.roleLabel', 'Role')}</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-neutral-400">{t('admin.joinedDate', 'Joined Date')}</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-neutral-400 text-right rtl:text-left">{t('admin.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 rtl:flex-row-reverse">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 ${
                          user.role === 'admin' ? 'bg-red-500' : 
                          user.role === 'instructor' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="rtl:text-right">
                          <p className="font-bold dark:text-white group-hover:text-primary-600 transition-colors">{user.name}</p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        {user.role === 'admin' && <Shield className="w-4 h-4 text-red-500" />}
                        {user.role === 'instructor' && <GraduationCap className="w-4 h-4 text-blue-500" />}
                        {user.role === 'student' && <UserCheck className="w-4 h-4 text-green-500" />}
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          user.role === 'admin' ? 'text-red-500' : 
                          user.role === 'instructor' ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {t(`common.${user.role}`, user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{user.created_at}</p>
                    </td>
                    <td className="px-8 py-6 text-right rtl:text-left">
                      <div className="flex justify-end rtl:justify-start gap-2">
                        <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
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
    </div>
  );
};

export default UsersManagement;