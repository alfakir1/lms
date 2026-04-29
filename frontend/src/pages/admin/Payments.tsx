import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { adminPaymentService } from '../../services/paymentService';
import type { Payment, PaymentStatus } from '../../services/paymentService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLang } from '../../context/LangContext';

const StatusChip: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const { lang } = useLang();
  const config = {
    approved: { cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'check_circle' },
    rejected: { cls: 'bg-red-500/10 text-red-600 border-red-500/20', icon: 'cancel' },
    under_review: { cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: 'visibility' },
    pending: { cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'pending' },
  };

  const { cls, icon } = config[status] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${cls}`}>
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {status.replace('_', ' ')}
    </div>
  );
};

const Payments: React.FC = () => {
  const { lang, dir } = useLang();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const queryClient = useQueryClient();

  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: () => adminPaymentService.getAll(statusFilter !== 'all' ? { status: statusFilter } : undefined),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => adminPaymentService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      if (selected) setSelected(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => adminPaymentService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      if (selected) setSelected(null);
    },
  });

  const payments = paymentsData?.data || [];

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p) => {
      return (
        String(p.user?.name || '').toLowerCase().includes(q) ||
        String(p.user?.email || '').toLowerCase().includes(q) ||
        String(p.course?.title || '').toLowerCase().includes(q)
      );
    });
  }, [payments, searchTerm]);

  const pendingCount = payments.filter(p => p.status === 'pending' || p.status === 'under_review').length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar' ? 'السجلات المالية' : 'Financial Ledger'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {pendingCount > 0 
              ? (lang === 'ar' ? `لديك ${pendingCount} معاملة بانتظار المراجعة.` : `You have ${pendingCount} transactions awaiting review.`)
              : (lang === 'ar' ? 'جميع المعاملات المالية تمت معالجتها.' : 'All financial transactions have been processed.')}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-container transition-colors">search</span>
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'بحث في المعاملات...' : 'Search ledger...'} 
                className="pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full sm:w-64 outline-none focus:ring-2 focus:ring-primary-container/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
             className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary-container/20"
           >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
           </select>
        </div>
      </header>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Volume', value: `$${payments.reduce((acc, p) => acc + Number(p.amount), 0).toLocaleString()}`, icon: 'payments', color: 'text-primary-container' },
           { label: 'Pending Approval', value: pendingCount, icon: 'pending_actions', color: 'text-amber-500' },
           { label: 'Conversion Rate', value: '84%', icon: 'trending_up', color: 'text-emerald-500' },
           { label: 'Processed Today', value: '12', icon: 'today', color: 'text-blue-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-start">{lang === 'ar' ? 'المعاملة' : 'Transaction'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-start">{lang === 'ar' ? 'الطالب' : 'Account'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-start">{lang === 'ar' ? 'الدورة' : 'Product'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-end">{lang === 'ar' ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((p, idx) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">#{p.id}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Draft'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-[10px] font-black text-primary-container uppercase">
                          {p.user?.name?.[0] || 'U'}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1">{p.user?.name || 'Guest'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{p.user?.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{p.course?.title || 'System Product'}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${Number(p.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <StatusChip status={p.status} />
                  </td>
                  <td className="px-8 py-6 text-end">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => setSelected(p)} className="p-2 text-slate-400 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                       </button>
                       {(p.status === 'pending' || p.status === 'under_review') && (
                          <div className="flex items-center gap-1">
                             <button onClick={() => approveMutation.mutate(p.id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                             </button>
                             <button onClick={() => rejectMutation.mutate(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                <span className="material-symbols-outlined text-xl">cancel</span>
                             </button>
                          </div>
                       )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelected(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] p-10 z-10 shadow-2xl relative border border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{lang === 'ar' ? 'تفاصيل المعاملة' : 'Transaction Dossier'}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: #PAY-{selected.id}</p>
                 </div>
                 <button onClick={() => setSelected(null)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Counterparty</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center font-black text-lg">
                             {selected.user?.name?.[0]}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 dark:text-white">{selected.user?.name}</p>
                             <p className="text-xs text-slate-500 font-medium">{selected.user?.email}</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Asset Details</p>
                       <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{selected.course?.title}</p>
                       <p className="text-2xl font-black text-primary-container">${Number(selected.amount).toFixed(2)}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentary Evidence</p>
                    <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 relative group">
                       {selected.proof_url ? (
                         <>
                            <img src={selected.proof_url} alt="Proof" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <a href={selected.proof_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <span className="material-symbols-outlined text-white text-4xl">open_in_new</span>
                            </a>
                         </>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <span className="material-symbols-outlined text-5xl mb-2">no_photography</span>
                            <p className="text-[10px] font-black uppercase">No proof attached</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Modal Governance Actions */}
              {(selected.status === 'pending' || selected.status === 'under_review') && (
                <div className="flex gap-4">
                   <button 
                     onClick={() => rejectMutation.mutate(selected.id)}
                     className="flex-1 bg-white dark:bg-slate-800 text-red-500 border border-red-500/20 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"
                   >
                     Reject Transaction
                   </button>
                   <button 
                     onClick={() => approveMutation.mutate(selected.id)}
                     className="flex-2 bg-primary-container text-white py-4 px-12 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary-container/20"
                   >
                     Confirm & Release
                   </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
