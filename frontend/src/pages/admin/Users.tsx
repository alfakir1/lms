import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { lang, dir } = useLang();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setFormData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const filteredUsers = users?.filter((u: User) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.login_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles: UserRole[] = currentUser?.role === 'super_admin' || currentUser?.role === 'admin'
    ? ['admin', 'instructor', 'student', 'reception'] 
    : ['student'];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10 pb-20" dir={dir}>
      {/* Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-xs">group</span>
              {lang === 'ar' ? 'إدارة الوصول' : 'Access Control'}
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
             {lang === 'ar' ? 'المستخدمين والنشاط' : 'Users & Activity'}
           </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <span className="material-symbols-outlined absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-container transition-colors">search</span>
              <input 
                type="text" 
                placeholder={lang === 'ar' ? "بحث بالاسم أو المعرف..." : "Search by name or ID..."} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container transition-all w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
             <button 
                onClick={() => { setFormData({ role: 'student' }); setIsModalOpen(true); }}
                className="bg-primary-container text-white px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
             >
                <span className="material-symbols-outlined">person_add</span>
                {lang === 'ar' ? 'إضافة مستخدم' : 'Create User'}
             </button>
           )}
        </div>
      </header>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'ar' ? 'المستخدم' : 'Identity'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'ar' ? 'المعرف' : 'ID'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'ar' ? 'الدور' : 'Role'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{lang === 'ar' ? 'التحكم' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredUsers?.map((u: User) => (
                <motion.tr 
                  layout
                  key={u.id} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-container to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-container/10">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">
                    {u.login_id}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.role === 'admin' || u.role === 'super_admin' ? 'bg-amber-500/10 text-amber-600' :
                      u.role === 'instructor' ? 'bg-primary-container/10 text-primary-container' :
                      'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        u.role === 'admin' || u.role === 'super_admin' ? 'bg-amber-600' :
                        u.role === 'instructor' ? 'bg-primary-container' :
                        'bg-emerald-600'
                      }`} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                    {new Date(u.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-primary-container hover:text-white transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">edit</span>
                       </button>
                       {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && u.id !== currentUser.id && (
                         <button 
                            onClick={() => {
                              if(window.confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Delete user?')) {
                                deleteMutation.mutate(u.id);
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                         >
                            <span className="material-symbols-outlined text-xl">delete</span>
                         </button>
                       )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] overflow-hidden z-10 shadow-2xl relative border border-white/10 p-10"
            >
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                 {lang === 'ar' ? 'مستخدم جديد' : 'New User'}
               </h3>
               
               <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                     <input 
                        required 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-container/10"
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{lang === 'ar' ? 'المعرف' : 'ID'}</label>
                        <input 
                           required 
                           className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-container/10"
                           value={formData.login_id || ''} 
                           onChange={e => setFormData({...formData, login_id: e.target.value})} 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{lang === 'ar' ? 'الدور' : 'Role'}</label>
                        <select 
                           className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-container/10"
                           value={formData.role || 'student'}
                           onChange={e => setFormData({...formData, role: e.target.value as any})}
                        >
                           {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                     <input 
                        type="email" 
                        required 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-container/10"
                        value={formData.email || ''} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                     <input 
                        type="password" 
                        required 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-container/10"
                        value={formData.password || ''} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                     />
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                     <button 
                        type="submit" 
                        disabled={createMutation.isPending}
                        className="flex-1 bg-primary-container text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all"
                     >
                        {createMutation.isPending ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                     </button>
                     <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                     >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
