import React from 'react';
import { useEnrollments } from '../hooks/useEnrollments';
import { BookOpen, Mail } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EnrollmentsPage: React.FC = () => {
  const { data: enrollments, isLoading } = useEnrollments();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الطلاب المسجلين</h1>
        <p className="text-slate-500 text-sm">عرض وإدارة الطلاب المسجلين في كورساتك.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">اسم الطالب</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">الكورس</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">حالة التسجيل</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">حالة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments?.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {enrollment.student?.user?.name?.[0]}
                      </div>
                      <span className="font-semibold text-slate-900">{enrollment.student?.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">{enrollment.course?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {enrollment.student?.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      enrollment.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {enrollment.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      enrollment.payment_status === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {enrollment.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                    </span>
                  </td>
                </tr>
              ))}
              {enrollments?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    لا يوجد طلاب مسجلين حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentsPage;
