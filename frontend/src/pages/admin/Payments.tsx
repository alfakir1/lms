import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, CreditCard, Eye, Search, X, XCircle, Loader2, FileText } from 'lucide-react';
import { adminPaymentService } from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';
import type { Payment, PaymentStatus } from '../../services/paymentService';

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config = {
    approved: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
    rejected: { cls: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-4 w-4 text-red-600" /> },
    under_review: { cls: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock className="h-4 w-4 text-blue-600" /> },
    pending: { cls: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="h-4 w-4 text-amber-600" /> },
  };

  const { cls, icon } = config[status];

  return (
    <div className="flex items-center">
      {icon}
      <span className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full border ${cls}`}>
        {status.replace('_', ' ')}
      </span>
    </div>
  );
};

const PaymentRowSkeleton: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-24" /></td>
    <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-28 ml-auto" /></td>
  </tr>
);

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: () => adminPaymentService.getAll(statusFilter !== 'all' ? { status: statusFilter } : undefined),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => adminPaymentService.approve(id),
    onSuccess: () => {
      showSuccess('Payment approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      if (selected) setSelected(null);
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to approve payment');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => adminPaymentService.reject(id),
    onSuccess: () => {
      showSuccess('Payment rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      if (selected) setSelected(null);
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to reject payment');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="text-primary-600" />
              Payments
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.from({ length: 5 }).map((_, i) => <PaymentRowSkeleton key={i} />)}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Payments</h2>
        <p className="text-slate-600 mb-6">Unable to fetch payment data. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="text-primary-600" />
              Payments
            </h1>
            <p className="text-slate-600 mt-1">
              {pendingCount > 0 ? (
                <span className="text-amber-600 font-medium">{pendingCount} payments pending review</span>
              ) : (
                'All payments have been processed'
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by student, email, course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">#{p.id}</div>
                      <div className="text-xs text-slate-500">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{p.user?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{p.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.course?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${Number(p.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(p)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-slate-600" />
                        </button>
                        {(p.status === 'pending' || p.status === 'under_review') && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(p.id)}
                              disabled={approveMutation.isPending}
                              className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {approveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                              Approve
                            </button>
                            <button
                              onClick={() => rejectMutation.mutate(p.id)}
                              disabled={rejectMutation.isPending}
                              className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {rejectMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <CreditCard className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No payments found</h3>
              <p className="text-slate-500">{searchTerm ? 'Try adjusting your search.' : 'No payment records available.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Payment Details</h3>
                <p className="text-sm text-slate-500">Payment #{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student</p>
                <p className="font-semibold text-slate-900">{selected.user?.name || 'N/A'}</p>
                <p className="text-sm text-slate-500">{selected.user?.email || ''}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course</p>
                <p className="font-semibold text-slate-900">{selected.course?.title || 'N/A'}</p>
                <p className="text-sm text-slate-500">Amount: ${Number(selected.amount).toFixed(2)}</p>
              </div>

              <div className="md:col-span-2 bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Proof</p>
                {selected.proof_url ? (
                  <div className="space-y-3">
                    <a
                      href={selected.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <FileText className="h-4 w-4" />
                      View Proof File
                    </a>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <img
                        src={selected.proof_url}
                        alt="Payment proof"
                        className="w-full max-h-[400px] object-contain rounded-lg"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500">
                    <FileText className="h-5 w-5" />
                    <p className="text-sm">No proof uploaded.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
              >
                Close
              </button>
              {(selected.status === 'pending' || selected.status === 'under_review') && (
                <>
                  <button
                    onClick={() => rejectMutation.mutate(selected.id)}
                    disabled={rejectMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                  </button>
                  <button
                    onClick={() => approveMutation.mutate(selected.id)}
                    disabled={approveMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
