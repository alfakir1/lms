import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, 
  Plus, X, List, Download, MessageSquare, Send, Award, Trash2, Edit, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Assignment, Submission } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import AssignmentReport from '../components/AssignmentReport';

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>({
    title: '',
    description: '',
    deadline: '',
    max_grade: 100,
    course_id: '',
    lesson_id: null
  });
  const [viewSubmissionsId, setViewSubmissionsId] = useState<number | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [showReportId, setShowReportId] = useState<number | null>(null);

  // Queries
  const { data: assignmentsRes, isLoading } = useQuery<{ success: boolean, data: Assignment[] }>({
    queryKey: ['assignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data;
    },
  });
  const assignments = assignmentsRes?.data || [];

  const { data: instructorCoursesRes } = useQuery<{ success: boolean, data: any[] }>({
    queryKey: ['instructor-courses'],
    queryFn: async () => {
      const res = await api.get('/courses');
      return res.data;
    },
    enabled: user?.role === 'instructor' || user?.role === 'admin',
  });
  const instructorCourses = instructorCoursesRes?.data || [];

  const { data: submissionsRes, isLoading: submissionsLoading } = useQuery<{ success: boolean, data: Submission[] }>({
    queryKey: ['submissions', viewSubmissionsId],
    queryFn: async () => {
      if (!viewSubmissionsId) return { success: true, data: [] };
      const res = await api.get(`/assignments/${viewSubmissionsId}/submissions`);
      return res.data;
    },
    enabled: !!viewSubmissionsId,
  });
  const submissions = submissionsRes?.data || [];

  // Mutations
  const saveAssignmentMutation = useMutation({
    mutationFn: async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title || '');
            formData.append('description', data.description || '');
            formData.append('deadline', data.deadline || data.due_date || '');
            formData.append('max_grade', (data.max_grade || 0).toString());
            formData.append('course_id', (data.course_id || 0).toString());
            if (data.lesson_id) formData.append('lesson_id', data.lesson_id.toString());
            if (data.assignment_file instanceof File) {
                formData.append('assignment_file', data.assignment_file);
            }

            console.log('--- SAVE ASSIGNMENT DEBUG ---');
            console.log('Payload Data:', data);
            
            if (!data.title || !data.course_id || !data.deadline) {
                console.error('CRITICAL: Missing required fields before sending!', {
                    title: data.title,
                    course_id: data.course_id,
                    deadline: data.deadline
                });
            }

            for (let pair of (formData as any).entries()) {
                console.log('FormData Entry -> ' + pair[0] + ': ' + pair[1]);
            }

            const token = localStorage.getItem('token');
            console.log('Auth Token Present:', !!token);

            if (data.id) {
                formData.append('_method', 'PUT');
                const res = await api.post(`/assignments/${data.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log('Update Success Response:', res.data);
                return res.data;
            } else {
                const res = await api.post('/assignments', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log('Create Success Response:', res.data);
                return res.data;
            }
        } catch (err: any) {
            console.error('--- SAVE ASSIGNMENT ERROR ---');
            console.error('Error Object:', err);
            if (err.response) {
                console.error('Response Data:', err.response.data);
                console.error('Response Status:', err.response.status);
            }
            throw err;
        }
    },
    onSuccess: () => {
      console.log('Mutation onSuccess triggered');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setShowFormModal(false);
      setEditingAssignment({ title: '', description: '', deadline: '', max_grade: 100, course_id: '' });
    },
    onError: (error: any) => {
        console.error('Save assignment mutation onError:', error);
        const msg = error.response?.data?.message || error.message || 'فشل حفظ المهمة.';
        alert(msg);
    }
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/assignments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignments'] })
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
        const formData = new FormData();
        formData.append('assignment_id', data.assignment_id.toString());
        if (data.content) formData.append('content', data.content);
        if (data.notes) formData.append('notes', data.notes);
        if (data.file instanceof File) {
            formData.append('file', data.file);
        }
        return api.post('/submissions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['assignments'] });
        queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
        setSubmittingId(null);
    }
  });

  const gradeMutation = useMutation({
    mutationFn: async (data: any) => api.put(`/submissions/${data.id}/grade`, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['submissions', viewSubmissionsId] });
        setGradingSubmission(null);
    }
  });

  // Helper: Get submission for student
  const { data: mySubmissionsRes } = useQuery<{ success: boolean, data: Submission[] }>({
      queryKey: ['my-submissions'],
      queryFn: async () => {
          const res = await api.get('/submissions');
          return res.data;
      },
      enabled: user?.role === 'student'
  });
  const mySubmissions = mySubmissionsRes?.data || [];

  const getStatus = (assignment: Assignment) => {
      if (user?.role === 'instructor') return 'instructor';
      const sub = mySubmissions.find(s => s.assignment_id === assignment.id);
      if (sub) return sub.status; // 'submitted' or 'graded'
      return new Date(assignment.deadline) < new Date() ? 'overdue' : 'pending';
  };

  const statusConfig: any = {
    pending:   { label: 'معلق',    color: 'bg-amber-50 text-amber-600',   icon: Clock },
    submitted: { label: 'مُسلَّم', color: 'bg-blue-50 text-blue-600',    icon: CheckCircle2 },
    graded:    { label: 'مُقيَّم', color: 'bg-emerald-50 text-emerald-600', icon: Award },
    overdue:   { label: 'متأخر',   color: 'bg-red-50 text-red-600',       icon: AlertCircle },
    instructor: { label: 'نشط',    color: 'bg-indigo-50 text-indigo-600', icon: FileText }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المهام والواجبات</h1>
          <p className="text-slate-500">تتبّع جميع مهامك وواجباتك الدراسية في مكان واحد.</p>
        </div>
        {(user?.role === 'instructor' || user?.role === 'admin') && (
          <Button onClick={() => { setEditingAssignment({ title: '', description: '', deadline: '', max_grade: 100, course_id: 0 }); setShowFormModal(true); }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة مهمة جديدة
          </Button>
        )}
      </div>

      {/* Assignment List */}
      <div className="grid gap-6">
        {isLoading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : assignments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-bold">لا توجد مهام حالياً</p>
            </div>
        ) : (
            assignments.map((assignment) => {
                const statusKey = getStatus(assignment);
                const status = statusConfig[statusKey];
                const mySub = mySubmissions.find(s => s.assignment_id === assignment.id);

                return (
                    <motion.div 
                        key={assignment.id} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900">{assignment.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{assignment.description}</p>
                                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> الموعد: {new Date(assignment.deadline).toLocaleDateString('ar-EG')}</div>
                                        <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> الدرجة القصوى: {assignment.max_grade}</div>
                                        {assignment.course && <div className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{assignment.course.title}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-center">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${status.color}`}>
                                    <status.icon className="w-3.5 h-3.5" />
                                    {status.label}
                                </span>
                                
                                {assignment.file_url && (
                                    <a href={assignment.file_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100" title="تحميل ملف المهمة">
                                        <Download className="w-4 h-4" />
                                    </a>
                                ) }

                                {user?.role === 'instructor' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setShowReportId(assignment.id); setViewSubmissionsId(assignment.id); }} className="p-2 text-slate-400 hover:text-primary" title="طباعة تقرير الدرجات"><Printer className="w-4 h-4" /></button>
                                        <button onClick={() => setViewSubmissionsId(assignment.id)} className="btn-secondary py-1.5 text-xs">عرض التسليمات</button>
                                        <button onClick={() => { setEditingAssignment(assignment); setShowFormModal(true); }} className="p-2 text-slate-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) deleteAssignmentMutation.mutate(assignment.id); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                )}

                                {user?.role === 'student' && (
                                    <div className="flex items-center gap-2">
                                        {statusKey === 'graded' && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-emerald-600 font-bold">الدرجة: {mySub?.grade} / {assignment.max_grade}</span>
                                                {mySub?.feedback && <button onClick={() => alert(`ملاحظات المحاضر:\n${mySub.feedback}`)} className="text-[10px] text-primary hover:underline">عرض الملاحظات</button>}
                                            </div>
                                        )}
                                        {statusKey !== 'graded' && statusKey !== 'overdue' && (
                                            <button onClick={() => setSubmittingId(assignment.id)} className="btn-primary py-1.5 text-xs">
                                                {statusKey === 'submitted' ? 'تعديل التسليم' : 'تسليم الآن'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })
        )}
      </div>

      {/* ─── Create/Edit Assignment Modal ─── */}
      <AnimatePresence>
        {showFormModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">{editingAssignment?.id ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</h2>
                        <button onClick={() => setShowFormModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); saveAssignmentMutation.mutate(editingAssignment); }} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">عنوان المهمة</label>
                            <input required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editingAssignment?.title || ''} onChange={e => setEditingAssignment(p => ({...p!, title: e.target.value}))} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">وصف المهمة</label>
                            <textarea required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none" rows={3} value={editingAssignment?.description || ''} onChange={e => setEditingAssignment(p => ({...p!, description: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">موعد التسليم</label>
                                <input required type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editingAssignment?.deadline?.split(' ')[0] || editingAssignment?.due_date?.split(' ')[0] || ''} onChange={e => setEditingAssignment(p => ({...p!, deadline: e.target.value}))} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">الدرجة القصوى</label>
                                <input required type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editingAssignment?.max_grade || 100} onChange={e => setEditingAssignment(p => ({...p!, max_grade: Number(e.target.value)}))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">الكورس</label>
                                <select required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editingAssignment?.course_id || ''} onChange={e => setEditingAssignment(p => ({...p!, course_id: Number(e.target.value), lesson_id: null}))}>
                                    <option value="">اختر الكورس...</option>
                                    {instructorCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">الدرس (اختياري)</label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" value={editingAssignment?.lesson_id || ''} onChange={e => setEditingAssignment(p => ({...p!, lesson_id: e.target.value ? Number(e.target.value) : null}))}>
                                    <option value="">عام (لا يوجد درس محدد)</option>
                                    {instructorCourses.find(c => c.id === Number(editingAssignment?.course_id))?.lessons?.map((l: any) => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">ملف المهمة (اختياري)</label>
                            <input type="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                                onChange={e => setEditingAssignment(p => ({...p!, assignment_file: e.target.files?.[0]}))} 
                            />
                        </div>
                        <Button type="submit" className="w-full py-4 rounded-2xl" loading={saveAssignmentMutation.isPending}>حفظ المهمة</Button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* ─── Student Submission Modal ─── */}
      <AnimatePresence>
        {submittingId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">تسليم المهمة</h2>
                        <button onClick={() => setSubmittingId(null)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        submitMutation.mutate({
                            assignment_id: submittingId,
                            content: target.content.value,
                            notes: target.notes.value,
                            file: target.file.files[0]
                        });
                    }} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">الإجابة النصية</label>
                            <textarea name="content" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none" rows={4} placeholder="اكتب إجابتك هنا..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">رفع ملف (اختياري)</label>
                            <input name="file" type="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">ملاحظات إضافية</label>
                            <input name="notes" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="أي ملاحظات للمحاضر..." />
                        </div>
                        <Button type="submit" className="w-full py-4 rounded-2xl" loading={submitMutation.isPending}>إرسال التسليم</Button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* ─── Instructor View Submissions Modal ─── */}
      <AnimatePresence>
        {viewSubmissionsId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-bold text-slate-900">تسليمات الطلاب</h2>
                        <button onClick={() => setViewSubmissionsId(null)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {submissionsLoading ? (
                             <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">لا توجد تسليمات لهذه المهمة بعد.</div>
                        ) : (
                            submissions.map(sub => (
                                <div key={sub.id} className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {sub.student?.user?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{sub.student?.user?.name}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(sub.submitted_at).toLocaleString('ar-EG')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {sub.status === 'graded' ? (
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">تم التقييم: {sub.grade}</span>
                                            ) : (
                                                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">بانتظار التقييم</span>
                                            )}
                                            <button onClick={() => setGradingSubmission(sub)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"><Award className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    {sub.content && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{sub.content}</p>}
                                    <div className="flex gap-2">
                                        {sub.file_url && <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"><Download className="w-3.5 h-3.5" /> تحميل ملف الطالب</a>}
                                        {sub.notes && <p className="text-[10px] text-slate-400 italic">ملاحظة: {sub.notes}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* ─── Grading Modal ─── */}
      <AnimatePresence>
        {gradingSubmission !== null && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">تقييم التسليم</h2>
                        <button onClick={() => setGradingSubmission(null)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        gradeMutation.mutate({
                            id: gradingSubmission.id,
                            grade: target.grade.value,
                            feedback: target.feedback.value
                        });
                    }} className="space-y-4">
                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-1">الدرجة (من {gradingSubmission.assignment?.max_grade || 100})</p>
                            <input name="grade" type="number" required min={0} max={gradingSubmission.assignment?.max_grade || 100} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" defaultValue={gradingSubmission.grade} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-1">ملاحظات للمطالب (اختياري)</p>
                            <textarea name="feedback" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none" rows={3} defaultValue={gradingSubmission.feedback} />
                        </div>
                        <Button type="submit" className="w-full py-4 rounded-2xl" loading={gradeMutation.isPending}>حفظ التقييم</Button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* ─── Assignment Report Modal (Printable) ─── */}
      <AnimatePresence>
        {showReportId !== null && (
            <AssignmentReport 
                assignment={assignments.find(a => a.id === showReportId)!}
                submissions={submissions}
                loading={submissionsLoading}
                onClose={() => setShowReportId(null)}
            />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Assignments;
