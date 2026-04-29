import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, GripVertical, Youtube, Video, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import Button from './ui/Button';

interface Lesson {
    id: number;
    title: string;
    content?: string;
    video_url?: string;
    video_type: 'html5' | 'youtube' | 'vimeo' | 'file';
    duration?: number;
    order: number;
    video_file?: File; // Added for uploads
}

interface ManageLessonsModalProps {
    courseId: number;
    lessons: Lesson[];
    onClose: () => void;
}

const ManageLessonsModal: React.FC<ManageLessonsModalProps> = ({ courseId, lessons: initialLessons, onClose }) => {
    const queryClient = useQueryClient();
    const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
    const [showForm, setShowForm] = useState(false);

    const lessons = [...initialLessons].sort((a, b) => a.order - b.order);

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const formData = new FormData();
            
            // Explicitly add all fields to ensure they are present
            formData.append('title', data.title || '');
            formData.append('content', data.content || '');
            formData.append('video_type', data.video_type || 'html5');
            formData.append('order', (data.order || 0).toString());
            
            if (data.video_url) formData.append('video_url', data.video_url);
            if (data.duration) formData.append('duration', data.duration.toString());
            if (data.video_file) formData.append('video_file', data.video_file);
            
            if (!data.id) {
                formData.append('course_id', courseId.toString());
                return api.post('/lessons', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                formData.append('_method', 'PUT');
                return api.post(`/lessons/${data.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
            setShowForm(false);
            setEditingLesson(null);
        },
        onError: (error: any) => {
            console.error('Save Lesson Error:', error.response?.data);
            alert(error.response?.data?.message || 'فشل حفظ الدرس. يرجى التأكد من حجم الملف ونوعه.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/lessons/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
        }
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(editingLesson);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">إدارة محتوى الكورس</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">أضف، رتب، أو عدل دروس الكورس</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {!showForm ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">قائمة الدروس ({lessons.length})</h3>
                                <Button onClick={() => { setEditingLesson({ video_type: 'youtube', order: lessons.length + 1 }); setShowForm(true); }} className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> إضافة درس جديد
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                                        <div className="text-xs font-black text-slate-300 w-6">{idx + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate">{lesson.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {lesson.video_type === 'youtube' ? <Youtube className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                                    {lesson.video_type}
                                                </span>
                                                {lesson.duration && (
                                                    <span className="text-[10px] font-bold text-slate-400">{Math.floor(lesson.duration / 60)} دقيقة</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingLesson(lesson); setShowForm(true); }}
                                                className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) deleteMutation.mutate(lesson.id) }}
                                                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {lessons.length === 0 && (
                                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                        <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold">لا توجد دروس في هذا الكورس بعد.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-6 max-w-2xl mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-black text-slate-900 mb-6">
                                {editingLesson?.id ? 'تعديل درس' : 'إضافة درس جديد'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2">عنوان الدرس *</label>
                                    <input 
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={editingLesson?.title || ''}
                                        onChange={e => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="مثال: مقدمة في البرمجة"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2">نوع الفيديو</label>
                                        <select 
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={editingLesson?.video_type || 'youtube'}
                                            onChange={e => setEditingLesson(prev => ({ ...prev, video_type: e.target.value as any }))}
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="vimeo">Vimeo</option>
                                            <option value="html5">رابط فيديو مباشر (MP4)</option>
                                            <option value="file">رفع فيديو من الجهاز</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2">الترتيب</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={editingLesson?.order || 0}
                                            onChange={e => setEditingLesson(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                {editingLesson?.video_type === 'file' ? (
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2">اختر ملف الفيديو *</label>
                                        <input 
                                            type="file"
                                            accept="video/*"
                                            required={!editingLesson?.id}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            onChange={e => setEditingLesson(prev => ({ ...prev, video_file: e.target.files?.[0] }))}
                                        />
                                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">الحد الأقصى: 100 ميجابايت (MP4, WebM)</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2">رابط الفيديو *</label>
                                        <div className="relative">
                                            {editingLesson?.video_type === 'youtube' ? (
                                                <Youtube className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                            ) : (
                                                <Video className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                            )}
                                            <input 
                                                required
                                                className="w-full bg-white border border-slate-200 rounded-2xl pr-14 pl-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={editingLesson?.video_url || ''}
                                                onChange={e => setEditingLesson(prev => ({ ...prev, video_url: e.target.value }))}
                                                placeholder={editingLesson?.video_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2">الوصف (اختياري)</label>
                                    <textarea 
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                                        value={editingLesson?.content || ''}
                                        onChange={e => setEditingLesson(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="تفاصيل إضافية حول الدرس..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-200">
                                <Button 
                                    type="submit" 
                                    className="flex-1 flex items-center justify-center gap-2 h-12"
                                    loading={saveMutation.isPending}
                                >
                                    <Save className="w-4 h-4" /> {editingLesson?.id ? 'حفظ التعديلات' : 'إضافة الدرس'}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="flex-1 h-12"
                                    onClick={() => { setShowForm(false); setEditingLesson(null); }}
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ManageLessonsModal;
