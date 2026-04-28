import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Plus, X, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Assignment } from '../types';
import { useAuth } from '../context/AuthContext';

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewSubmissionsId, setViewSubmissionsId] = useState<number | null>(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', max_grade: 100, course_id: '' });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ['assignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data;
    },
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', viewSubmissionsId],
    queryFn: async () => {
      if (!viewSubmissionsId) return [];
      const res = await api.get(`/assignments/${viewSubmissionsId}/submissions`);
      return res.data;
    },
    enabled: !!viewSubmissionsId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newAssignment) => {
      const res = await api.post('/assignments', { ...data, course_id: Number(data.course_id), max_grade: Number(data.max_grade) });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setCreateSuccess(true);
      setTimeout(() => { setShowCreateModal(false); setCreateSuccess(false); setNewAssignment({ title: '', description: '', due_date: '', max_grade: 100, course_id: '' }); }, 1500);
    },
    onError: (err: any) => {
      setCreateError(err?.response?.data?.message || 'فشل إنشاء المهمة. تأكد من ملء جميع الحقول.');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    createMutation.mutate(newAssignment);
  };

  const statusConfig = {
    pending:   { label: 'معلق',    color: 'bg-amber-50 text-amber-600',   icon: Clock },
    submitted: { label: 'مُسلَّم', color: 'bg-blue-50 text-blue-600',    icon: CheckCircle2 },
    graded:    { label: 'مُقيَّم', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    overdue:   { label: 'متأخر',   color: 'bg-red-50 text-red-600',       icon: AlertCircle },
  };

  // Fallback placeholder data when API returns nothing yet
  const placeholders = [
    { id: 1, course_id: 1, title: 'مشروع تصميم واجهة المستخدم', description: 'صمّم واجهة مستخدم لتطبيق جوّال باستخدام Figma', due_date: '2024-04-30', max_grade: 100, _status: 'pending' as const },
    { id: 2, course_id: 2, title: 'تطوير REST API', description: 'أنشئ API كامل باستخدام Laravel Sanctum', due_date: '2024-04-25', max_grade: 100, _status: 'submitted' as const },
    { id: 3, course_id: 1, title: 'اختبار قواعد البيانات', description: 'قم بتصميم قاعدة بيانات متكاملة لنظام LMS', due_date: '2024-04-20', max_grade: 50, _status: 'graded' as const },
    { id: 4, course_id: 3, title: 'تحليل متطلبات المشروع', description: 'أعدّ وثيقة متطلبات كاملة للمشروع النهائي', due_date: '2024-04-15', max_grade: 30, _status: 'overdue' as const },
  ];

  const displayItems = assignments.length > 0
    ? assignments.map((a) => ({ ...a, _status: 'pending' as const }))
    : placeholders;

  const filtered = filter === 'all' ? displayItems : displayItems.filter(a => a._status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المهام والواجبات</h1>
          <p className="text-slate-500">تتبّع جميع مهامك وواجباتك الدراسية في مكان واحد.</p>
        </div>
        {user?.role === 'instructor' && (
          <button onClick={() => { setShowCreateModal(true); setCreateError(''); setCreateSuccess(false); }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة مهمة جديدة
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'submitted', 'graded'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {{ all: 'الكل', pending: 'معلق', submitted: 'مُسلَّم', graded: 'مُقيَّم' }[tab]}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {/* Assignment Cards */}
      {!isLoading && (
        <div className="space-y-4">
          {filtered.map((assignment, index) => {
            const status = statusConfig[assignment._status];
            const StatusIcon = status.icon;
            const isOverdue = new Date(assignment.due_date) < new Date() && assignment._status === 'pending';
            const effectiveStatus = isOverdue ? statusConfig.overdue : status;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="text-primary w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{assignment.description}</p>
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>موعد التسليم: {new Date(assignment.due_date).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>الدرجة الكاملة: {assignment.max_grade}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${effectiveStatus.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {effectiveStatus.label}
                    </span>
                    {user?.role === 'student' && assignment._status === 'pending' && (
                      <Link
                        to={`/assignments/${assignment.id}/submit`}
                        className="flex items-center gap-1 text-primary text-sm font-bold hover:underline"
                      >
                        تسليم المهمة <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                    {user?.role === 'instructor' && (
                      <button
                        onClick={() => setViewSubmissionsId(assignment.id)}
                        className="flex items-center gap-1 text-sm text-slate-500 font-semibold hover:text-primary transition-colors"
                      >
                        <List className="w-4 h-4" /> عرض التسليمات
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">لا توجد مهام في هذه الفئة.</p>
            </div>
          )}
        </div>
      )}
      {/* ─── Create Assignment Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">إضافة مهمة جديدة</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              {createSuccess && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl font-semibold text-sm">✅ تم إنشاء المهمة بنجاح!</div>}
              {createError && <div className="bg-red-50 text-red-700 p-3 rounded-xl font-semibold text-sm">{createError}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-1">عنوان المهمة *</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} placeholder="مثال: مشروع تصميم الواجهة" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-1">الوصف *</label>
                  <textarea required rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" value={newAssignment.description} onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))} placeholder="وصف المهمة والمتطلبات" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1">تاريخ التسليم *</label>
                    <input required type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={newAssignment.due_date} onChange={e => setNewAssignment(p => ({ ...p, due_date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1">الدرجة الكاملة *</label>
                    <input required type="number" min={1} max={200} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={newAssignment.max_grade} onChange={e => setNewAssignment(p => ({ ...p, max_grade: Number(e.target.value) }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-1">معرّف الكورس *</label>
                  <input required type="number" min={1} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={newAssignment.course_id} onChange={e => setNewAssignment(p => ({ ...p, course_id: e.target.value }))} placeholder="مثال: 1" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">إلغاء</button>
                  <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {createMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ المهمة'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Submissions Modal ─── */}
      <AnimatePresence>
        {viewSubmissionsId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setViewSubmissionsId(null); }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">تسليمات المهمة</h2>
                <button onClick={() => setViewSubmissionsId(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              {submissionsLoading && <div className="text-center py-8 text-slate-400">جارٍ التحميل...</div>}
              {!submissionsLoading && submissions.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">لا توجد تسليمات بعد</p>
                </div>
              )}
              {!submissionsLoading && submissions.length > 0 && (
                <div className="space-y-3">
                  {(submissions as any[]).map((sub: any) => (
                    <div key={sub.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{sub.student?.user?.name || sub.student_id}</p>
                        <p className="text-xs text-slate-400">{new Date(sub.submitted_at || sub.created_at).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.grade != null && <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">الدرجة: {sub.grade}</span>}
                        {sub.file_path && <a href={sub.file_path} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-semibold hover:underline">عرض الملف</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
