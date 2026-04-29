import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, File, X, Send, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { Assignment } from '../types';

const SubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: assignment, isLoading } = useQuery<Assignment>({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (selectedFile) formData.append('file', selectedFile);
      formData.append('assignment_id', id!);
      formData.append('notes', notes);
      return api.post('/submissions', formData);
    },
    onSuccess: () => {
      setSubmitStatus('success');
      setTimeout(() => navigate('/assignments'), 2500);
    },
    onError: () => setSubmitStatus('error'),
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> العودة للمهام
      </button>

      {/* Assignment Info */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 text-white">
        <p className="text-white/70 text-sm mb-2">تسليم مهمة</p>
        <h1 className="text-2xl font-bold mb-3">
          {assignment?.title ?? 'مشروع تصميم واجهة المستخدم'}
        </h1>
        <p className="text-white/80 text-sm mb-6">
          {assignment?.description ?? 'صمّم واجهة مستخدم لتطبيق جوّال باستخدام Figma وفق المتطلبات المحددة.'}
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-white/60 text-xs">موعد التسليم</p>
            <p className="font-bold">
              {assignment?.due_date ? new Date(assignment.due_date).toLocaleDateString('ar-EG') : '30 أبريل 2024'}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs">الدرجة الكاملة</p>
            <p className="font-bold">{assignment?.max_grade ?? 100} درجة</p>
          </div>
        </div>
      </div>

      {/* Success/Error State */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4"
          >
            <CheckCircle2 className="text-emerald-500 w-8 h-8 shrink-0" />
            <div>
              <p className="font-bold text-emerald-800">تم تسليم المهمة بنجاح!</p>
              <p className="text-sm text-emerald-600">سيتم مراجعتها من قِبل المدرّس قريباً. جارٍ التحويل…</p>
            </div>
          </motion.div>
        )}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4"
          >
            <AlertCircle className="text-red-500 w-8 h-8 shrink-0" />
            <div>
              <p className="font-bold text-red-800">حدث خطأ أثناء التسليم</p>
              <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm">
        <h2 className="font-bold text-slate-900 text-lg">رفع الملف</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-slate-200 hover:border-primary hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
          />
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${dragOver ? 'text-primary' : 'text-slate-300'}`} />
          <p className="font-semibold text-slate-700">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
          <p className="text-sm text-slate-400 mt-1">PDF, Word, ZIP, RAR, أو صور — حجم أقصى 50MB</p>
        </div>

        {/* Selected File Preview */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <File className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">ملاحظات (اختياري)</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف أي ملاحظات أو شروحات تتعلق بعملك..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all text-right"
            dir="rtl"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => submitMutation.mutate()}
          disabled={!selectedFile || submitMutation.isPending || submitStatus === 'success'}
          className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitMutation.isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
          ) : (
            <>
              <Send className="w-5 h-5" /> تسليم المهمة
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubmissionPage;
