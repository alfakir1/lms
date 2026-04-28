import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AttendancePage: React.FC = () => {
  const qc = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data.data),
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', selectedCourse],
    queryFn: () => api.get('/enrollments', { params: { course_id: selectedCourse } }).then(r => r.data.data),
    enabled: !!selectedCourse,
  });

  const markMutation = useMutation({
    mutationFn: (data: { student_id: number; course_id: number; date: string; status: string }) =>
      api.post('/attendance', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }),
  });

  if (coursesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">تسجيل الحضور والغياب</h1>
        <div className="flex gap-4">
          <select
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            value={selectedCourse || ''}
          >
            <option value="">اختر الكورس...</option>
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input
            type="date"
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {!selectedCourse ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>يرجى اختيار كورس لعرض قائمة الطلاب</p>
        </div>
      ) : enrollmentsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">الطالب</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold text-center">تسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {enrollments?.map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{e.student?.user?.name}</p>
                    <p className="text-xs text-slate-500">{e.student?.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${e.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {e.status === 'active' ? 'ملتحق' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => markMutation.mutate({ student_id: e.student_id, course_id: selectedCourse, date: selectedDate, status: 'present' })}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                        title="حاضر"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => markMutation.mutate({ student_id: e.student_id, course_id: selectedCourse, date: selectedDate, status: 'absent' })}
                        className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                        title="غائب"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => markMutation.mutate({ student_id: e.student_id, course_id: selectedCourse, date: selectedDate, status: 'late' })}
                        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                        title="متأخر"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
