import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useCourses } from '../hooks/useCourses';
import { Plus, Brain, Lock, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AssessmentsPage: React.FC = () => {
    const { user } = useAuth();
    const isInstructor = user?.role === 'instructor';
    const isStudent = user?.role === 'student';
    const { data: courses } = useCourses();
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printAssessment, setPrintAssessment] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', type: 'quiz', duration_minutes: 15, total_score: 100 });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: assessments, isLoading } = useQuery({
        queryKey: ['assessments', selectedCourse],
        queryFn: async () => {
            if (!selectedCourse) return [];
            const res = await api.get(`/courses/${selectedCourse}/assessments`);
            return res.data.data;
        },
        enabled: !!selectedCourse
    });

    const generateAiMutation = useMutation({
        mutationFn: async ({ assessmentId, lessonIds }: { assessmentId: number, lessonIds: number[] }) => {
            const res = await api.post(`/assessments/${assessmentId}/generate`, { lesson_ids: lessonIds });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessments', selectedCourse] });
            alert("تم توليد الأسئلة بنجاح!");
        }
    });

    const publishMutation = useMutation({
        mutationFn: async (assessmentId: number) => {
            const res = await api.put(`/assessments/${assessmentId}`, { status: 'published' });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessments', selectedCourse] });
        }
    });

    const createDraftMutation = useMutation({
        mutationFn: async () => {
            if (!selectedCourse) return;
            const res = await api.post('/assessments', {
                course_id: selectedCourse,
                type: formData.type,
                title: formData.title,
                duration_minutes: formData.duration_minutes,
                description: `الدرجة الكلية: ${formData.total_score}`
            });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessments', selectedCourse] });
            setIsModalOpen(false);
            setFormData({ title: '', type: 'quiz', duration_minutes: 15, total_score: 100 });
        },
        onError: () => {
            alert("حدث خطأ أثناء الإنشاء. يرجى التأكد من ملء الحقول.");
        }
    });

    // Handle Printing
    React.useEffect(() => {
        if (printAssessment) {
            setTimeout(() => window.print(), 300);
            const handleAfterPrint = () => setPrintAssessment(null);
            window.addEventListener('afterprint', handleAfterPrint);
            return () => window.removeEventListener('afterprint', handleAfterPrint);
        }
    }, [printAssessment]);

    return (
        <div className="relative">
            {/* Normal UI */}
            <div className="space-y-6 print:hidden">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">التقييمات والاختبارات (الذكاء الاصطناعي)</h1>
                {isInstructor && selectedCourse && (
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> إضافة اختبار جديد
                    </button>
                )}
            </div>

            <div className="flex gap-4 mb-6">
                <select 
                    className="p-2 border rounded-lg bg-white min-w-[200px]"
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    value={selectedCourse || ''}
                >
                    <option value="" disabled>اختر الكورس...</option>
                    {courses?.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {!selectedCourse ? (
                <div className="text-center text-slate-500 py-10">الرجاء اختيار كورس لعرض الاختبارات</div>
            ) : isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid gap-4">
                    {assessments?.length === 0 && (
                        <div className="text-center text-slate-500 py-4">لا توجد اختبارات لهذا الكورس.</div>
                    )}
                    {assessments?.map((assessment: any) => (
                        <div key={assessment.id} className="p-6 bg-white border rounded-xl shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    {assessment.title}
                                    {assessment.status === 'draft' && <span className="text-xs bg-slate-100 px-2 py-1 rounded">مسودة</span>}
                                    {assessment.auto_generated && <span title="مولد بالذكاء الاصطناعي"><Brain className="w-4 h-4 text-purple-500" /></span>}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">المدة: {assessment.duration_minutes} دقيقة | النوع: {assessment.type}</p>
                                
                                {isStudent && assessment.is_locked && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                        <Lock className="w-3 h-3" /> مقفل: يرجى إكمال الدروس المطلوبة أولاً
                                    </div>
                                )}
                                {isStudent && assessment.has_submitted && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                                        <CheckCircle2 className="w-3 h-3" /> تم التسليم (الدرجة: {assessment.grade ?? 'قيد التصحيح'})
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                {isInstructor && assessment.status === 'draft' && (
                                    <>
                                        <button 
                                            onClick={() => {
                                                const lessonIds = prompt("أدخل أرقام الدروس مفصولة بفاصلة (مثال: 1,2,3)");
                                                if (lessonIds) {
                                                    generateAiMutation.mutate({ 
                                                        assessmentId: assessment.id, 
                                                        lessonIds: lessonIds.split(',').map(n => Number(n.trim()))
                                                    });
                                                }
                                            }}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <Brain className="w-4 h-4" /> توليد بالـ AI
                                        </button>
                                        <button 
                                            onClick={() => setPrintAssessment(assessment)}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <Printer className="w-4 h-4" /> طباعة
                                        </button>
                                        <button 
                                            onClick={() => publishMutation.mutate(assessment.id)}
                                            className="btn-primary"
                                        >
                                            نشر
                                        </button>
                                    </>
                                )}
                                {isStudent && !assessment.is_locked && !assessment.has_submitted && (
                                    <button 
                                        onClick={() => navigate(`/assessments/${assessment.id}/attempt`)}
                                        className="btn-primary"
                                    >
                                        بدء الاختبار
                                    </button>
                                )}
                                {isInstructor && (
                                     <button onClick={() => navigate(`/assessments/${assessment.id}/submissions`)} className="btn-secondary">
                                         التسليمات
                                     </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assessment Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-xl font-bold">إنشاء اختبار جديد (مسودة)</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold mb-1">عنوان الاختبار</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2 rounded-lg" 
                                    value={formData.title}
                                    onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                                    placeholder="مثال: اختبار منتصف الفصل"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">نوع الاختبار</label>
                                <select 
                                    className="w-full border p-2 rounded-lg"
                                    value={formData.type}
                                    onChange={e => setFormData(p => ({...p, type: e.target.value}))}
                                >
                                    <option value="quiz">اختبار قصير (Quiz)</option>
                                    <option value="midterm">ميدتيرم (Midterm)</option>
                                    <option value="final">نهائي (Final)</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold mb-1">المدة (بالدقائق)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border p-2 rounded-lg" 
                                        value={formData.duration_minutes}
                                        onChange={e => setFormData(p => ({...p, duration_minutes: Number(e.target.value)}))}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold mb-1">الدرجة الكلية</label>
                                    <input 
                                        type="number" 
                                        className="w-full border p-2 rounded-lg" 
                                        value={formData.total_score}
                                        onChange={e => setFormData(p => ({...p, total_score: Number(e.target.value)}))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">إلغاء</button>
                            <button 
                                onClick={() => createDraftMutation.mutate()} 
                                disabled={!formData.title || createDraftMutation.isPending} 
                                className="btn-primary"
                            >
                                {createDraftMutation.isPending ? 'جاري الإنشاء...' : 'حفظ كمسودة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>

            {/* Print Only Layout */}
            {printAssessment && (
                <div className="hidden print:block p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans">
                    <div className="text-center mb-10 border-b-2 border-slate-800 pb-6">
                        <h1 className="text-4xl font-black uppercase tracking-widest">Four A Academy</h1>
                        <p className="text-lg font-bold text-slate-600 tracking-wider mt-2">Official Examination</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10 text-sm font-bold border-b border-slate-300 pb-6">
                        <div className="space-y-2">
                            <div className="flex gap-2"><span className="text-slate-500 w-24">Course:</span> <span className="uppercase">{courses?.find(c => c.id === selectedCourse)?.title}</span></div>
                            <div className="flex gap-2"><span className="text-slate-500 w-24">Exam:</span> <span className="uppercase">{printAssessment.title}</span></div>
                        </div>
                        <div className="space-y-2 text-right">
                            <div className="flex justify-end gap-2"><span className="text-slate-500 w-24 text-left">Type:</span> <span className="uppercase">{printAssessment.type}</span></div>
                            <div className="flex justify-end gap-2"><span className="text-slate-500 w-24 text-left">Duration:</span> <span>{printAssessment.duration_minutes} Minutes</span></div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {printAssessment.questions?.map((q: any, idx: number) => (
                            <React.Fragment key={q.id}>
                                <div className="question mb-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-start gap-2">
                                        <span className="text-slate-400">Q{idx + 1}.</span> {q.question_text}
                                    </h3>
                                    
                                    {q.question_type === 'mcq' && q.options ? (
                                        <div className="pl-8 space-y-3">
                                            {JSON.parse(q.options).map((opt: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-slate-400 rounded-full"></div>
                                                    <span className="font-medium text-slate-700">{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pl-8 mt-4">
                                            <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl"></div>
                                        </div>
                                    )}
                                </div>
                                {idx > 0 && idx % 3 === 0 && (
                                    <div className="page-break"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentsPage;
