import React, { useState } from 'react';
import { TrendingUp, Award, BookOpen, BarChart3, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Grade } from '../types';
import { useAuth } from '../context/AuthContext';

interface GradeWithMeta extends Grade {
  course_name?: string;
  assignment_title?: string;
}

const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const { data: grades = [], isLoading } = useQuery<GradeWithMeta[]>({
    queryKey: ['grades'],
    queryFn: async () => {
      const res = await api.get('/grades');
      return res.data;
    },
  });

  // Fallback placeholder data
  const placeholderGrades: GradeWithMeta[] = [
    { id: 1, student_id: 1, course_id: 1, grade: 92, type: 'assignment', course_name: 'تطوير واجهات React', assignment_title: 'مشروع واجهة المستخدم' },
    { id: 2, student_id: 1, course_id: 1, grade: 88, type: 'exam',       course_name: 'تطوير واجهات React', assignment_title: 'اختبار منتصف الفصل' },
    { id: 3, student_id: 1, course_id: 2, grade: 95, type: 'assignment', course_name: 'Laravel Backend',   assignment_title: 'بناء REST API' },
    { id: 4, student_id: 1, course_id: 2, grade: 78, type: 'exam',       course_name: 'Laravel Backend',   assignment_title: 'اختبار نهائي' },
    { id: 5, student_id: 1, course_id: 3, grade: 85, type: 'final',      course_name: 'تصميم قواعد البيانات', assignment_title: 'مشروع التخرج' },
  ];

  const displayGrades = grades.length > 0 ? grades : placeholderGrades;

  // Group by course
  const byCourse = displayGrades.reduce<Record<string, GradeWithMeta[]>>((acc, g) => {
    const key = g.course_name ?? `Course ${g.course_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  const overallAvg = displayGrades.length
    ? Math.round(displayGrades.reduce((s, g) => s + g.grade, 0) / displayGrades.length)
    : 0;

  const gradeColor = (g: number) => {
    if (g >= 90) return 'text-emerald-600 bg-emerald-50';
    if (g >= 75) return 'text-blue-600 bg-blue-50';
    if (g >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const gradeBar = (g: number) => {
    if (g >= 90) return 'bg-emerald-500';
    if (g >= 75) return 'bg-blue-500';
    if (g >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const gradeLabel = (g: number) => {
    if (g >= 90) return 'ممتاز';
    if (g >= 75) return 'جيد جداً';
    if (g >= 60) return 'جيد';
    return 'مقبول';
  };

  const typeLabel: Record<string, string> = { assignment: 'مهمة', exam: 'اختبار', final: 'نهائي' };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الدرجات والأداء</h1>
        <p className="text-slate-500">
          {user?.role === 'student' ? 'تتبّع درجاتك وأدائك الدراسي.' : 'مراجعة وإدارة درجات الطلاب.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'المعدل العام', value: `${overallAvg}%`, icon: TrendingUp, color: 'bg-indigo-500' },
          { label: 'المهام المقيَّمة', value: String(displayGrades.length), icon: BarChart3, color: 'bg-purple-500' },
          { label: 'شهادات مكتسبة', value: '2', icon: Award, color: 'bg-amber-500' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-xl`}>
              <card.icon className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{card.label}</p>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {/* Grades by Course */}
      {!isLoading && (
        <div className="space-y-4">
          {Object.entries(byCourse).map(([courseName, courseGrades], courseIndex) => {
            const courseAvg = Math.round(courseGrades.reduce((s, g) => s + g.grade, 0) / courseGrades.length);
            const isExpanded = expandedCourse === courseIndex;

            return (
              <motion.div
                key={courseName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: courseIndex * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
              >
                {/* Course Header */}
                <button
                  onClick={() => setExpandedCourse(isExpanded ? null : courseIndex)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-primary w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-slate-900">{courseName}</h3>
                      <p className="text-sm text-slate-500">{courseGrades.length} درجة مسجّلة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">المعدل</p>
                      <p className={`text-lg font-black px-3 py-0.5 rounded-lg ${gradeColor(courseAvg)}`}>{courseAvg}%</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Grades List */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 space-y-3">
                      {courseGrades.map((grade) => (
                        <div key={grade.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg">
                              {typeLabel[grade.type] ?? grade.type}
                            </span>
                            <p className="text-sm font-semibold text-slate-700">{grade.assignment_title}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {/* Progress bar */}
                            <div className="hidden sm:flex items-center gap-2 w-32">
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${gradeBar(grade.grade)} rounded-full transition-all`}
                                  style={{ width: `${grade.grade}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-base font-black px-3 py-1 rounded-lg ${gradeColor(grade.grade)}`}>
                                {grade.grade}%
                              </p>
                              <p className="text-[10px] text-slate-400 text-center mt-0.5">{gradeLabel(grade.grade)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GradesPage;
