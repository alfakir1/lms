import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Printer, Save, CheckCircle2, XCircle } from 'lucide-react';

const AssessmentSubmissionsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [manualGrade, setManualGrade] = useState<string>('');

    const { data, isLoading } = useQuery({
        queryKey: ['assessment-submissions', id],
        queryFn: async () => {
            const res = await api.get(`/assessments/${id}/submissions`);
            return res.data.data;
        }
    });

    const gradeMutation = useMutation({
        mutationFn: async ({ subId, grade }: { subId: number, grade: number }) => {
            const res = await api.post(`/assessments/${id}/submissions/${subId}/grade`, { grade });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assessment-submissions', id] });
            
            // Manual state update to ensure UI reflects immediately
            setSelectedSubmission((prev: any) => ({
                ...prev,
                grade: variables.grade
            }));
            
            alert('تم حفظ الدرجة بنجاح');
        }
    });

    const handlePrint = () => {
        if (!assessment?.questions?.length) return;

        setTimeout(() => {
            window.print();
        }, 300);
    };

    if (isLoading) return <LoadingSpinner />;

    const assessment = data?.assessment;
    const submissions = data?.submissions || [];

    if (!assessment) return <div className="p-10 text-center">Assessment not found</div>;

    return (
        <div className="relative">
            {/* List View (Hidden during print) */}
            {!selectedSubmission && (
                <div className="space-y-6 print:hidden">
                    <div className="flex justify-between items-center">
                        <div>
                            <button onClick={() => navigate('/assessments')} className="text-sm text-slate-500 mb-2 hover:underline">← العودة للاختبارات</button>
                            <h1 className="text-2xl font-bold">تسليمات الاختبار: {assessment.title}</h1>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-bold">الطالب</th>
                                    <th className="p-4 font-bold">تاريخ التسليم</th>
                                    <th className="p-4 font-bold">الدرجة التلقائية (MCQ)</th>
                                    <th className="p-4 font-bold">الدرجة النهائية</th>
                                    <th className="p-4 font-bold">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد تسليمات حتى الآن</td>
                                    </tr>
                                )}
                                {submissions.map((sub: any) => {
                                    const parsedAnswers = sub.answers ? JSON.parse(sub.answers) : {};
                                    return (
                                        <tr key={sub.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4">{parsedAnswers.student_name || sub.student?.user?.name || 'غير معروف'}</td>
                                            <td className="p-4 text-sm text-slate-500">{new Date(sub.submitted_at).toLocaleString('ar-EG')}</td>
                                            <td className="p-4">
                                                {parsedAnswers.auto_mcq_score} / {parsedAnswers.max_mcq_score}
                                            </td>
                                            <td className="p-4 font-bold">
                                                {sub.grade !== null ? <span className="text-emerald-600">{sub.grade}</span> : <span className="text-amber-600">غير مقيم</span>}
                                            </td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedSubmission(sub);
                                                        setManualGrade(sub.grade?.toString() || '');
                                                    }}
                                                    className="btn-secondary text-sm"
                                                >
                                                    مراجعة وتقييم
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail / Grading View */}
            {selectedSubmission && (
                <div className="space-y-6">
                    {/* Toolbar (Hidden during print) */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden">
                        <button onClick={() => setSelectedSubmission(null)} className="btn-secondary">
                            ← العودة للقائمة
                        </button>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border">
                                <label className="font-bold text-sm">الدرجة النهائية:</label>
                                <input 
                                    type="number" 
                                    className="w-20 p-1 border rounded text-center"
                                    value={manualGrade}
                                    onChange={e => setManualGrade(e.target.value)}
                                />
                                <button 
                                    onClick={() => gradeMutation.mutate({ subId: selectedSubmission.id, grade: Number(manualGrade) })}
                                    disabled={gradeMutation.isPending || manualGrade === ''}
                                    className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                                >
                                    <Save className="w-4 h-4" /> حفظ
                                </button>
                            </div>
                            {assessment?.questions?.length > 0 && (
                                <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                                    <Printer className="w-4 h-4" /> طباعة
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Printable Exam Paper */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-900 font-sans max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
                        <div className="text-center mb-10 border-b-2 border-slate-800 pb-6">
                            <h1 className="text-4xl font-black uppercase tracking-widest">Four A Academy</h1>
                            <p className="text-lg font-bold text-slate-600 tracking-wider mt-2">Graded Examination</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10 text-sm font-bold border-b border-slate-300 pb-6">
                            <div className="space-y-2">
                                <div className="flex gap-2"><span className="text-slate-500 w-24">Student:</span> <span className="uppercase">{JSON.parse(selectedSubmission.answers)?.student_name || selectedSubmission.student?.user?.name}</span></div>
                                <div className="flex gap-2"><span className="text-slate-500 w-24">Exam:</span> <span className="uppercase">{assessment.title}</span></div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="flex justify-end gap-2"><span className="text-slate-500 w-32 text-left">Auto MCQ Score:</span> <span>{JSON.parse(selectedSubmission.answers)?.auto_mcq_score} / {JSON.parse(selectedSubmission.answers)?.max_mcq_score}</span></div>
                                <div className="flex justify-end gap-2"><span className="text-slate-500 w-32 text-left">Final Grade:</span> <span className="text-lg text-emerald-700">{selectedSubmission.grade !== null ? selectedSubmission.grade : 'Not Graded'}</span></div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {assessment.questions?.map((q: any, idx: number) => {
                                const studentResponses = JSON.parse(selectedSubmission.answers)?.responses || {};
                                const studentAnswer = studentResponses[q.id];
                                const isCorrect = q.question_type === 'mcq' && studentAnswer?.toLowerCase() === q.correct_answer?.toLowerCase();

                                return (
                                    <React.Fragment key={q.id}>
                                        <div className="question mb-6 border-b border-slate-100 pb-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-lg flex items-start gap-2">
                                                <span className="text-slate-400">Q{idx + 1}.</span> {q.question_text}
                                            </h3>
                                            {q.question_type === 'mcq' && (
                                                <div>
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                    ) : (
                                                        <XCircle className="w-6 h-6 text-red-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {q.question_type === 'mcq' && q.options ? (
                                            <div className="pl-8 space-y-3">
                                                {JSON.parse(q.options).map((opt: string, i: number) => {
                                                    const isStudentPick = studentAnswer === opt;
                                                    const isActualCorrect = q.correct_answer === opt;
                                                    
                                                    let boxClass = "border-slate-300";
                                                    let bgClass = "";
                                                    
                                                    if (isStudentPick && isActualCorrect) {
                                                        boxClass = "border-emerald-500 bg-emerald-500";
                                                    } else if (isStudentPick && !isActualCorrect) {
                                                        boxClass = "border-red-500 bg-red-500";
                                                    } else if (!isStudentPick && isActualCorrect) {
                                                        boxClass = "border-emerald-500 border-dashed";
                                                        bgClass = "bg-emerald-50";
                                                    }

                                                    return (
                                                        <div key={i} className={`flex items-center gap-3 p-2 rounded ${bgClass}`}>
                                                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${boxClass}`}>
                                                                {isStudentPick && <div className="w-2 h-2 bg-white rounded-full" />}
                                                            </div>
                                                            <span className={`font-medium ${isActualCorrect ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>{opt}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="pl-8 mt-4 space-y-4">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Student's Answer:</span>
                                                    <div className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 whitespace-pre-wrap">
                                                        {studentAnswer || <span className="text-slate-400 italic">No answer provided</span>}
                                                    </div>
                                                </div>
                                                {q.correct_answer && (
                                                    <div>
                                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Model Answer:</span>
                                                        <div className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 whitespace-pre-wrap">
                                                            {q.correct_answer}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        </div>
                                        {idx > 0 && idx % 3 === 0 && (
                                            <div className="page-break"></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentSubmissionsPage;
