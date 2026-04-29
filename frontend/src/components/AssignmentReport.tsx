import React from 'react';
import { Submission, Assignment } from '../types';
import { FileText, Printer, Download, CheckCircle2, Award, Clock } from 'lucide-react';

interface Props {
  assignment: Assignment;
  submissions: Submission[];
  loading?: boolean;
  onClose: () => void;
}

const AssignmentReport: React.FC<Props> = ({ assignment, submissions, loading, onClose }) => {
  const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.grade !== null);
  const totalSubmissions = submissions.length;
  const averageGrade = gradedSubmissions.length > 0
    ? (gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length).toFixed(1)
    : '0';

  const highestGrade = gradedSubmissions.length > 0
    ? Math.max(...gradedSubmissions.map(s => s.grade || 0))
    : '0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        {/* Controls - Hidden on print */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <span>تقرير الدرجات للمهمة</span>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              <Printer className="w-4 h-4" /> طباعة التقرير
            </button>
            <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
              إغلاق
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8 text-right" dir="rtl">
          {/* Header */}
          <div className="flex justify-between items-center pb-8 border-b-4 border-double border-slate-900">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">أكاديمية التعليم المستمر</h1>
              <p className="text-lg font-bold text-slate-600">مركز التدريب والتمكين المهني</p>
              <p className="text-sm text-slate-500">نظام إدارة التعلم (LMS)</p>
            </div>
            <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center text-white rotate-3">
              <Award className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center py-4 bg-slate-100 rounded-xl print:bg-slate-50">
            <h2 className="text-2xl font-black text-slate-900">تقرير نتائج الطلاب - المهمة الدراسية</h2>
          </div>

          {/* Assignment & Stats Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Box */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-slate-100">
              <h3 className="font-black text-slate-900 border-b pb-2 mb-4">معلومات المهمة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold">عنوان المهمة:</p>
                  <p className="font-bold text-slate-900">{assignment.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold">الكورس:</p>
                  <p className="font-bold text-slate-900">{assignment.course?.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold">الموعد النهائي:</p>
                  <p className="font-bold text-slate-900">{new Date(assignment.deadline).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold">الدرجة القصوى:</p>
                  <p className="font-bold text-slate-900">{assignment.max_grade}</p>
                </div>
              </div>
            </div>

            {/* Stats Box */}
            <div className="space-y-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200 print:shadow-none print:border-2 print:border-slate-900 print:text-black print:bg-transparent">
              <h3 className="font-black border-b border-slate-700 pb-2 mb-4 print:border-slate-900">إحصائيات النتائج</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white/10 rounded-xl print:border print:border-slate-200">
                  <p className="text-[10px] opacity-70 font-bold">إجمالي التسليمات</p>
                  <p className="text-2xl font-black">{totalSubmissions}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl print:border print:border-slate-200">
                  <p className="text-[10px] opacity-70 font-bold">تم تقييمها</p>
                  <p className="text-2xl font-black">{gradedSubmissions.length}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl print:border print:border-slate-200">
                  <p className="text-[10px] opacity-70 font-bold">متوسط الدرجات</p>
                  <p className="text-2xl font-black text-emerald-400 print:text-emerald-700">{averageGrade}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl print:border print:border-slate-200">
                  <p className="text-[10px] opacity-70 font-bold">أعلى درجة</p>
                  <p className="text-2xl font-black text-amber-400 print:text-amber-700">{highestGrade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-hidden border-2 border-slate-900 rounded-2xl">
            <table className="w-full text-right">
              <thead className="bg-slate-900 text-white print:bg-slate-100 print:text-black">
                <tr>
                  <th className="px-6 py-4 font-black border-l border-slate-800 print:border-slate-300">#</th>
                  <th className="px-6 py-4 font-black border-l border-slate-800 print:border-slate-300">اسم الطالب</th>
                  <th className="px-6 py-4 font-black border-l border-slate-800 print:border-slate-300">تاريخ التسليم</th>
                  <th className="px-6 py-4 font-black border-l border-slate-800 print:border-slate-300">الحالة</th>
                  <th className="px-6 py-4 font-black">الدرجة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        <p className="text-slate-400 font-bold">جاري تحميل البيانات...</p>
                      </div>
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                      لا توجد تسليمات مسجلة لهذه المهمة الدراسية حتى الآن.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, idx) => (
                    <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 print:bg-transparent'}>
                      <td className="px-6 py-4 text-slate-400 font-bold border-l border-slate-100">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 border-l border-slate-100">{sub.student?.user?.name}</td>
                      <td className="px-6 py-4 text-slate-600 border-l border-slate-100">{new Date(sub.submitted_at).toLocaleDateString('ar-EG')}</td>
                      <td className="px-6 py-4 border-l border-slate-100">
                        {sub.status === 'graded' ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> تم التقييم
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> بانتظار التقييم
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-lg">
                            {sub.grade != null ? `${sub.grade} / ${assignment.max_grade}` : '-'}
                          </span>
                          {sub.grade != null && (
                            <div className="w-full bg-slate-100 h-1 rounded-full mt-1 overflow-hidden print:border print:border-slate-200">
                              <div
                                className="bg-primary h-full"
                                style={{ width: `${(sub.grade / assignment.max_grade) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Validation */}
          <div className="space-y-12 pt-12">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-8">توقيع المدرس المعتمد:</p>
                <div className="h-16 w-48 border-b-2 border-dotted border-slate-300"></div>
              </div>
              <div className="space-y-4">
                <p className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-8">ختم الأكاديمية الرسمي:</p>
                <div className="h-24 w-24 border-4 border-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-200 font-black rotate-12">
                  OFFICIAL STAMP
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-bold">
              <span>تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}</span>
              <span>نظام Four A Academy - جميع الحقوق محفوظة</span>
              <span>صفحة 1 من 1</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1.5cm; }
        }
      `}} />
    </div>
  );
};


export default AssignmentReport;
