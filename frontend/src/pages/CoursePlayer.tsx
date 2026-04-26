import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, PauseCircle, CheckCircle2, Lock,
  BookOpen, ChevronRight, ChevronLeft, Volume2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Course, Lesson } from '../types';

const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ['course-player', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Placeholder lessons when API returns none
  const lessons: Lesson[] = course?.lessons?.length
    ? course.lessons
    : Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        course_id: Number(id),
        title: `الدرس ${i + 1}: ${['مقدمة وتثبيت البيئة', 'الأنواع والمتغيرات', 'الدوال والنطاق', 'المصفوفات والكائنات', 'React أساسيات', 'إدارة الحالة', 'API Integration', 'النشر والإنتاج'][i]}`,
        order: i + 1,
      }));

  const active = lessons[currentLesson];
  const progress = Math.round(((currentLesson + 1) / lessons.length) * 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-0 -m-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> العودة
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-900 truncate">{course?.title ?? 'تطوير واجهات React'}</h1>
          <p className="text-xs text-slate-500">{active?.title}</p>
        </div>
        {/* Overall progress */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-slate-500">{progress}% مكتمل</span>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <BookOpen className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Main Player Area */}
      <div className="flex h-[calc(100vh-12rem)]">

        {/* Video / Content Area */}
        <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
          {/* Video Viewport */}
          <div className="flex-1 relative flex items-center justify-center">
            {active?.video_url ? (
              <video
                key={active.id}
                src={active.video_url}
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <div className="text-center text-white/60 space-y-4">
                <div
                  className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying
                    ? <PauseCircle className="w-12 h-12 text-white" />
                    : <PlayCircle className="w-12 h-12 text-white" />}
                </div>
                <p className="text-sm">{active?.title}</p>
                <p className="text-xs text-white/30">فيديو الدرس • 15:34</p>
              </div>
            )}

            {/* Lesson Navigation Overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/80 to-transparent">
              <button
                disabled={currentLesson === 0}
                onClick={() => setCurrentLesson(p => p - 1)}
                className="flex items-center gap-2 text-white/80 hover:text-white disabled:opacity-30 text-sm font-medium transition-colors"
              >
                <ChevronRight className="w-5 h-5" /> الدرس السابق
              </button>
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-white/60 cursor-pointer hover:text-white transition-colors" />
                <Maximize2 className="w-5 h-5 text-white/60 cursor-pointer hover:text-white transition-colors" />
              </div>
              <button
                disabled={currentLesson === lessons.length - 1}
                onClick={() => setCurrentLesson(p => p + 1)}
                className="flex items-center gap-2 text-white/80 hover:text-white disabled:opacity-30 text-sm font-medium transition-colors"
              >
                الدرس التالي <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — Lesson List */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white border-r border-slate-100 overflow-y-auto overflow-x-hidden"
            >
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">محتوى الكورس</h2>
                <p className="text-xs text-slate-500 mt-1">{lessons.length} درس</p>
              </div>

              <div className="divide-y divide-slate-50">
                {lessons.map((lesson, index) => {
                  const isActive   = index === currentLesson;
                  const isComplete = index < currentLesson;
                  const isLocked   = index > currentLesson + 2;

                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={!isLocked ? { x: -2 } : {}}
                      onClick={() => !isLocked && setCurrentLesson(index)}
                      disabled={isLocked}
                      className={`w-full text-right flex items-center gap-3 p-4 transition-colors ${
                        isActive
                          ? 'bg-primary/5 border-r-4 border-primary'
                          : isLocked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isComplete ? 'bg-emerald-100' : isActive ? 'bg-primary' : 'bg-slate-100'
                      }`}>
                        {isLocked
                          ? <Lock className="w-4 h-4 text-slate-400" />
                          : isComplete
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          : <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                              {index + 1}
                            </span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">فيديو • 15 دقيقة</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursePlayer;
