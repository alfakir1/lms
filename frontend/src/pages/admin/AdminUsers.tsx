import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const AdminUsers: React.FC = () => {
  const { lang, t, dir } = useLang();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin-users', roleFilter],
    queryFn: () => adminService.getUsers(roleFilter ? { role: roleFilter } : {}),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role, status }: { id: number; role?: string; status?: string }) => adminService.updateUser(id, { role, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const users = usersData?.data || [];
  const filteredUsers = users.filter((u: any) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar' ? 'إدارة المستخدمين' : 'User Governance'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {lang === 'ar' ? 'تحكم في صلاحيات الوصول والحسابات لجميع أعضاء المنصة.' : 'Control access privileges and accounts for all platform members.'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-container transition-colors">search</span>
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'بحث باسم المستخدم...' : 'Search by name...'} 
                className="pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full sm:w-64 outline-none focus:ring-2 focus:ring-primary-container/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <select 
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
             className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary-container/20"
           >
              <option value="">{lang === 'ar' ? 'كل الأدوار' : 'All Roles'}</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
           </select>
           <button className="bg-primary-container text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-container/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span>{lang === 'ar' ? 'مستخدم جديد' : 'Invite User'}</span>
           </button>
        </div>
      </header>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-start">{lang === 'ar' ? 'المستخدم' : 'Identity'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{lang === 'ar' ? 'الدور' : 'System Role'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-end">{lang === 'ar' ? 'الإجراءات' : 'Governance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredUsers.map((user: any, idx: number) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container font-black shadow-inner">
                        {user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <select
                        value={user.role}
                        onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                        className="bg-transparent text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 outline-none cursor-pointer hover:text-primary-container transition-colors"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <button
                        onClick={() => updateRoleMutation.mutate({ id: user.id, status: user.status === 'active' ? 'banned' : 'active' })}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                          user.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-600 border border-red-500/20'
                        }`}
                      >
                        {user.status || 'Active'}
                      </button>
                  </td>
                  <td className="px-8 py-6 text-end">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all">
                           <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                           <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-32 text-center">
             <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-white/5 mb-4">person_search</span>
             <p className="text-slate-400 font-bold">{lang === 'ar' ? 'لم يتم العثور على مستخدمين.' : 'No users match your search.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
