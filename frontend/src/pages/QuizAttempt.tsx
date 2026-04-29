import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { AlertCircle, Timer, Send } from 'lucide-react';

const QuizAttempt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [studentName, setStudentName] = useState('');
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [violationCount, setViolationCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionData, setSubmissionData] = useState<any>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['assessment-attempt', id],
        queryFn: async () => {
            const res = await api.get(`/assessments/${id}`);
            return res.data.data;
        },
        retry: false
    });

    const submitMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post(`/assessments/${id}/submit`, payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['assessments'] });
            setSubmissionData(data.data);
            setIsSubmitted(true);
            window.scrollTo(0, 0);
        },
        onError: () => {
            alert('حدث خطأ أثناء التسليم أو أنك قمت بالتسليم مسبقاً.');
            navigate('/courses');
        }
    });

    const handleSubmit = useCallback(() => {
        if (!studentName.trim()) {
            alert('الرجاء إدخال اسم الطالب أولاً.');
            return;
        }
        if (submitMutation.isPending) return;
        submitMutation.mutate({
            answers,
            violation_count: violationCount,
            student_name: studentName
        });
    }, [answers, violationCount, studentName, submitMutation]);

    // Timer Logic
    useEffect(() => {
        if (data?.assessment?.duration_minutes && timeLeft === null) {
            setTimeLeft(data.assessment.duration_minutes * 60);
        }

        if (timeLeft !== null && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev! - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            alert('انتهى الوقت! سيتم تسليم إجاباتك تلقائياً.');
            handleSubmit();
        }
    }, [data, timeLeft, handleSubmit]);

    // Anti-Cheating: Prevent Navigation
    useEffect(() => {
        if (isSubmitted) return; // Disable once submitted

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Standard for most browsers to show warning
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitted]);

    // Anti-Cheating: Visibility Change
    useEffect(() => {
        if (isSubmitted) return; // Disable once submitted
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolationCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert('لقد تجاوزت الحد المسموح به لمغادرة الصفحة. سيتم تسليم الاختبار فوراً.');
                        handleSubmit();
                    } else {
                        alert(`تحذير (${newCount}/3): يرجى عدم مغادرة صفحة الاختبار!`);
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [handleSubmit, isSubmitted]);

    // Anti-Cheating: Prevent Copy/Paste/Context Menu
    const preventCheatingEvents = (e: React.SyntheticEvent | Event) => {
        if (isSubmitted) return;
        e.preventDefault();
        return false;
    };

    useEffect(() => {
        if (isSubmitted) return;
        const preventGlobalKeys = (e: KeyboardEvent) => {
            // Prevent Ctrl+C, Ctrl+V, F12, etc. (Basic prevention)
            if ((e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'p')) || e.key === 'F12') {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', preventGlobalKeys);
        return () => window.removeEventListener('keydown', preventGlobalKeys);
    }, [isSubmitted]);

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <div className="text-center py-20 text-red-500 font-bold">غير مصرح لك بدخول هذا الاختبار.</div>;

    const { assessment, questions } = data;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div 
            className={`max-w-4xl mx-auto space-y-8 py-8 px-4 ${!isSubmitted ? 'select-none' : ''}`}
            onCopy={preventCheatingEvents}
            onCut={preventCheatingEvents}
            onPaste={preventCheatingEvents}
            onContextMenu={preventCheatingEvents}
        >
            {isSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex items-center justify-between mb-8 print:hidden shadow-sm">
                    <div className="flex items-center gap-3 font-bold">
                        <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
                            ✓
                        </div>
                        Exam Submitted Successfully!
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 hidden" /> Print Exam
                        </button>
                        <button onClick={() => navigate('/courses')} className="btn-secondary">
                            Back to Courses
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-white border-2 border-slate-800 rounded-lg p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-800 print:hidden" />
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Four A Academy</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Official Examination</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold border-t border-slate-200 pt-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 w-24">Student Name:</span>
                            {isSubmitted ? (
                                <span className="text-slate-900 uppercase">{studentName}</span>
                            ) : (
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    className="flex-1 border-b-2 border-slate-300 focus:border-slate-800 outline-none pb-1 bg-transparent transition-colors text-slate-900"
                                    value={studentName}
                                    onChange={e => setStudentName(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 w-24">Course:</span>
                            <span className="text-slate-900 uppercase">{assessment.course?.title || 'General Course'}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4 md:text-right flex flex-col md:items-end">
                        <div className="flex items-center gap-3 md:flex-row-reverse">
                            <span className="text-slate-500">Type:</span>
                            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded uppercase tracking-wider">{assessment.type}</span>
                        </div>
                        <div className="flex items-center gap-3 md:flex-row-reverse">
                            <span className="text-slate-500">Duration:</span>
                            <span className="text-slate-900">{assessment.duration_minutes} Minutes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Timer */}
            {!isSubmitted && (
                <div className="sticky top-4 z-50 flex justify-between items-center bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-xl shadow-lg print:hidden">
                    <h2 className="font-black text-slate-800">{assessment.title}</h2>
                    <div className="flex items-center gap-4">
                        {violationCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg font-bold">
                                <AlertCircle className="w-4 h-4" /> Violations: {violationCount}
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold tracking-widest font-mono">
                            <Timer className="w-5 h-5 text-slate-400" />
                            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                        </div>
                    </div>
                </div>
            )}

            {/* Questions Section */}
            <div className="space-y-8">
                {questions.map((q: any, idx: number) => (
                    <React.Fragment key={q.id}>
                        <div className="question bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-slate-800 transition-colors" />
                            
                            <div className="flex items-start gap-4 mb-6">
                            <span className="font-black text-xl text-slate-300">Q{idx + 1}</span>
                            <h3 className="font-bold text-lg leading-relaxed text-slate-800 mt-0.5">
                                {q.question_text}
                            </h3>
                        </div>
                        
                        {q.question_type === 'mcq' && q.options ? (
                            <div className="space-y-3 pl-10">
                                {q.options.map((opt: string, i: number) => (
                                    <label key={i} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[q.id] === opt ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-slate-800' : 'border-slate-300'}`}>
                                            {answers[q.id] === opt && <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name={`q_${q.id}`} 
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            className="hidden"
                                            disabled={isSubmitted}
                                        />
                                        <span className="font-medium text-slate-700 text-lg">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="pl-10">
                                <textarea 
                                    className="w-full border-2 border-slate-200 rounded-xl p-4 min-h-[150px] focus:border-slate-800 outline-none resize-y text-lg text-slate-700 bg-slate-50 focus:bg-white transition-colors disabled:opacity-80"
                                    placeholder="Type your answer here..."
                                    value={answers[q.id] || ''}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    disabled={isSubmitted}
                                />
                            </div>
                        )}
                        </div>
                        {idx > 0 && idx % 3 === 0 && (
                            <div className="page-break"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {!isSubmitted && (
                <div className="flex justify-end pt-8 pb-12 border-t border-slate-200 mt-8 print:hidden">
                    <button 
                        onClick={handleSubmit} 
                        disabled={submitMutation.isPending}
                        className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-black tracking-widest transition-colors shadow-xl shadow-slate-900/20 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                        {submitMutation.isPending ? 'SUBMITTING...' : 'SUBMIT ASSESSMENT'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizAttempt;
