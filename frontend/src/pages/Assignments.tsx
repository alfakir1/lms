import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Assignment } from '../types';
import { useAuth } from '../context/AuthContext';

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ['assignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data;
    },
  });

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
          <button className="btn-primary flex items-center gap-2">
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
                      <button className="text-sm text-slate-500 font-semibold hover:text-primary transition-colors">
                        عرض التسليمات
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
    </div>
  );
};

export default Assignments;
