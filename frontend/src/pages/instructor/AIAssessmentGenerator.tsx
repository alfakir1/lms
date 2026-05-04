import React, { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { useLang } from '../../context/LangContext';
import api from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, ChevronDown, Loader2,
  CheckCircle, AlertCircle, Copy, Check, RotateCcw
} from 'lucide-react';

interface Question {
  question_text?: string;
  question?: string;
  options: string[];
  correct_option_index?: number;
  correct_answer?: string;
  explanation?: string;
}

interface Assessment {
  title: string;
  description?: string;
  questions: Question[];
}

const AIAssessmentGenerator: React.FC = () => {
  const { lang } = useLang();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCourseId) return;
    setIsGenerating(true);
    setAssessment(null);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await api.post(`/ai/generate-assessment/${selectedCourseId}`);
      const data = res.data?.data;
      if (data && data.questions) {
        setAssessment(data);
      } else {
        setError(lang === 'ar' ? 'لم يتم إنشاء الاختبار بشكل صحيح.' : 'Assessment was not generated correctly.');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) {
        setError(lang === 'ar'
          ? '⏳ تجاوزت الحد اليومي للذكاء الاصطناعي. حاول لاحقاً.'
          : '⏳ AI daily limit reached. Please try again later.');
      } else {
        setError(lang === 'ar'
          ? '⚠️ فشل إنشاء الاختبار. تأكد من وجود دروس في الكورس.'
          : '⚠️ Failed to generate assessment. Make sure the course has lessons.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!assessment || !selectedCourseId) return;
    setIsSaving(true);
    setError(null);

    try {
      await api.post('/ai/save-assessment', {
        course_id: selectedCourseId,
        title: assessment.title,
        questions: assessment.questions
      });
      setSaveSuccess(true);
      // Optional: redirect or show success
    } catch (err: any) {
      setError(lang === 'ar' ? 'فشل في حفظ الاختبار.' : 'Failed to save assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyJSON = () => {
    if (!assessment) return;
    navigator.clipboard.writeText(JSON.stringify(assessment, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedCourse = courses?.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {lang === 'ar' ? 'مولّد الاختبارات بالذكاء الاصطناعي' : 'AI Assessment Generator'}
          </h1>
        </div>
        <p className="text-muted-foreground font-medium ml-13">
          {lang === 'ar'
            ? 'اختر كورساً وسيقوم الذكاء الاصطناعي بتحليل محتواه وإنشاء اختبار متكامل تلقائياً.'
            : 'Select a course and AI will analyze its content and automatically generate a complete assessment.'}
        </p>
      </motion.div>

      {/* Generator Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* Course Selector */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-sm font-black text-foreground uppercase tracking-widest">
              {lang === 'ar' ? 'اختر الكورس' : 'Select Course'}
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                id="course-select"
                value={selectedCourseId || ''}
                onChange={e => setSelectedCourseId(Number(e.target.value) || null)}
                className="input-field pl-11 pr-10 appearance-none w-full"
                disabled={coursesLoading}
              >
                <option value="">
                  {coursesLoading
                    ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')
                    : (lang === 'ar' ? '-- اختر كورساً --' : '-- Choose a course --')}
                </option>
                {courses?.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="generate-assessment-btn"
            onClick={handleGenerate}
            disabled={!selectedCourseId || isGenerating}
            className="btn-primary h-[46px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {lang === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {lang === 'ar' ? 'أنشئ الاختبار' : 'Generate Assessment'}
              </>
            )}
          </button>
        </div>

        {/* Info Banner */}
        {selectedCourse && !assessment && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3"
          >
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground font-medium">
              {lang === 'ar'
                ? `سيقوم الذكاء الاصطناعي بتحليل دروس كورس "${selectedCourse.title}" وإنشاء 5-10 أسئلة اختيار متعدد.`
                : `AI will analyze lessons of "${selectedCourse.title}" and generate 5-10 multiple-choice questions.`}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 py-12"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
              </div>
              <p className="text-foreground font-black">
                {lang === 'ar' ? 'الذكاء الاصطناعي يحلل المحتوى...' : 'AI is analyzing the content...'}
              </p>
              <p className="text-muted-foreground text-sm">
                {lang === 'ar' ? 'قد يستغرق هذا 10-30 ثانية' : 'This may take 10–30 seconds'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Assessment Result */}
      <AnimatePresence>
        {assessment && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Result Header */}
            <div className="premium-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground">{assessment.title}</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      {assessment.questions.length} {lang === 'ar' ? 'أسئلة' : 'questions'} •{' '}
                      {lang === 'ar' ? 'تم الإنشاء بنجاح' : 'Generated successfully'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {saveSuccess ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-black animate-in zoom-in-95">
                      <CheckCircle className="w-4 h-4" />
                      {lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved Successfully!'}
                    </div>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl text-sm font-black transition-colors"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {lang === 'ar' ? 'حفظ في الكورس' : 'Save to Course'}
                    </button>
                  )}
                  <button
                    onClick={handleCopyJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-border rounded-xl text-sm font-bold transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied!') : 'JSON'}
                  </button>
                  <button
                    onClick={() => { setAssessment(null); setSelectedCourseId(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-border rounded-xl text-sm font-bold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {lang === 'ar' ? 'إعادة' : 'Reset'}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {assessment.questions.map((q, idx) => {
                const questionText = q.question_text || q.question || '';
                const correctIdx = q.correct_option_index ?? 
                  q.options.findIndex(o => o === q.correct_answer);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="premium-card p-6"
                  >
                    {/* Question Number & Text */}
                    <div className="flex items-start gap-4 mb-5">
                      <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-bold text-foreground leading-relaxed pt-1">{questionText}</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-12">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === correctIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                                : 'bg-muted/40 border-border text-muted-foreground'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500 text-white'
                                : 'bg-border text-muted-foreground'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            {opt}
                            {isCorrect && <CheckCircle className="w-4 h-4 ml-auto text-emerald-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-4 ml-12 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">
                          {lang === 'ar' ? 'الشرح' : 'Explanation'}
                        </p>
                        <p className="text-sm text-foreground font-medium">{q.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssessmentGenerator;
