import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, FileText, Loader2, Search } from 'lucide-react';
import { paymentService, type Payment, type PaymentStatus } from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const map: Record<PaymentStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    under_review: 'bg-sky-50 text-sky-700 border-sky-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const StudentPayments: React.FC = () => {
  const [search, setSearch] = useState('');
  const { showError } = useToast();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => paymentService.getAll({ per_page: 20 }),
  });

  const payments = data?.data || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p: Payment) => {
      const title = p.course?.title || '';
      return String(p.id).includes(q) || title.toLowerCase().includes(q) || p.status.toLowerCase().includes(q);
    });
  }, [payments, search]);

  if (error) {
    const message = (error as any)?.message || 'Failed to load payments.';
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Couldn’t load payments</h2>
          <p className="text-slate-600 mb-4">{message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-7 w-7 text-primary" />
              Payments
            </h1>
            <p className="text-slate-600 mt-1">Track your enrollment payment requests and their status.</p>
          </div>
          <button
            onClick={async () => {
              try {
                await refetch();
              } catch (e: any) {
                showError(e?.message || 'Failed to refresh.');
              }
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-800 disabled:opacity-50"
            disabled={isRefetching}
          >
            {isRefetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course, status, or ID…"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 flex items-center justify-center text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading payments…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-600">
              <p className="font-semibold text-slate-900 mb-1">No payments found</p>
              <p className="text-sm">When you submit a course payment proof, it appears here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Proof</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">#{p.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{p.course?.title || `Course #${p.course_id}`}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">${Number(p.amount).toFixed(2)}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-4 text-sm">
                        {p.proof_url ? (
                          <a
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                            href={p.proof_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;

