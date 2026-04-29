import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Lock, BookOpen, ChevronRight, ChevronLeft,
  FileText, Clock, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Course, Lesson } from '../types';
import { useCourseProgress, useUpdateProgress } from '../hooks/useCourses';
import VideoPlayer from '../components/VideoPlayer';

const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course, isLoading: isCourseLoading } = useQuery<Course>({
    queryKey: ['course-player', id],
    queryFn: async () => {
      console.log('Fetching course data for ID:', id);
      const res = await api.get(`/courses/${id}`);
      console.log('Course API Response:', res.data);
      return res.data.data;
    },
    enabled: !!id,
  });

  const { data: progressData } = useCourseProgress(Number(id));
  const updateProgress = useUpdateProgress();

  const lessons: Lesson[] = useMemo(() => {
     if (course?.lessons?.length) {
         // Ensure they are sorted by order
         return [...course.lessons].sort((a, b) => a.order - b.order);
     }
     return [];
  }, [course?.lessons]);

  const activeLesson = lessons[currentLessonIndex];
  
  // Find current lesson's progress
  const currentProgress = progressData?.find((p: any) => p.lesson_id === activeLesson?.id);
  const lastPosition = currentProgress ? parseFloat(currentProgress.last_position) : 0;

  // Handle saving progress periodically
  const handleVideoProgress = (currentTime: number, duration: number, percent: number) => {
    if (!activeLesson) return;
    
    // Send update every ~5 seconds or significant jump to avoid spamming
    // We'll rely on the VideoPlayer to only call this if needed, or we throttle here
    // For safety, let's just trigger update mutation directly, react-query will handle deduplication if configured,
    // but a better way is to throttle in the component. We'll send it directly here since VideoPlayer calls it every 1s,
    // actually sending an API request every 1s is too much.
    // We'll throttle inside the callback using a ref.
  };

  // Throttle API calls
  const lastApiCall = React.useRef(0);
  const latestTimeRef = React.useRef(lastPosition);

  const handleThrottledProgress = (currentTime: number, duration: number, percent: number) => {
    latestTimeRef.current = currentTime;
    const now = Date.now();
    const isThresholdReached = percent >= 90 && !currentProgress?.completed;
    
    // Send update every 5 seconds OR instantly if we just reached the 90% threshold
    if (now - lastApiCall.current > 5000 || isThresholdReached) {
      lastApiCall.current = now;
      if (activeLesson) {
          updateProgress.mutate({
             lessonId: activeLesson.id,
             lastPosition: currentTime,
             percentWatched: percent
          });
      }
    }
  };

  const handleVideoEnded = () => {
    if (activeLesson) {
        // Mark as 100% and completed
        updateProgress.mutate({
            lessonId: activeLesson.id,
            lastPosition: latestTimeRef.current, // Keep last position
            percentWatched: 100
        }, {
            onSuccess: () => {
                // Auto-advance if not the last lesson
                if (currentLessonIndex < lessons.length - 1) {
                    setTimeout(() => {
                        setCurrentLessonIndex(prev => prev + 1);
                    }, 1000); // Small delay for better UX
                }
            }
        });
    }
  };

  // Calculate overall course progress
  const completedLessonsCount = lessons.filter(l => 
    progressData?.find((p: any) => p.lesson_id === l.id)?.completed
  ).length;
  const overallProgress = lessons.length ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (lessons.length === 0) {
     return <div className="p-8 text-center text-slate-500">لا يوجد محتوى في هذا الكورس بعد.</div>;
  }

  return (
    <div className="space-y-0 -m-6 h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-100 shadow-sm shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> العودة
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-900 truncate">{course?.title}</h1>
          <p className="text-xs text-slate-500">{activeLesson?.title}</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-slate-500">{overallProgress}% مكتمل</span>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
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
      <div className="flex flex-1 overflow-hidden">

        {/* Video / Content Area */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <VideoPlayer
                key={activeLesson?.id} // Force remount on lesson change
                url={activeLesson?.video_url}
                type={activeLesson?.video_type || 'html5'}
                title={activeLesson?.title}
                lastPosition={lastPosition}
                onProgress={handleThrottledProgress}
                onEnded={handleVideoEnded}
            />
          </div>

          {/* Lesson Navigation Overlay (Optional, if you want custom controls at the bottom outside the video) */}
          <div className="shrink-0 flex items-center justify-between p-4 bg-slate-900 border-t border-slate-800">
            <button
              disabled={currentLessonIndex === 0}
              onClick={() => setCurrentLessonIndex(p => p - 1)}
              className="flex items-center gap-2 text-white/80 hover:text-white disabled:opacity-30 text-sm font-medium transition-colors"
            >
              <ChevronRight className="w-5 h-5" /> الدرس السابق
            </button>
            
            <button
              disabled={currentLessonIndex === lessons.length - 1 || !progressData?.find((p:any) => p.lesson_id === activeLesson?.id)?.completed}
              onClick={() => setCurrentLessonIndex(p => p + 1)}
              className="flex items-center gap-2 text-white/80 hover:text-white disabled:opacity-30 text-sm font-medium transition-colors"
              title={!progressData?.find((p:any) => p.lesson_id === activeLesson?.id)?.completed ? 'أكمل الدرس الحالي للانتقال للتالي' : ''}
            >
              الدرس التالي <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar — Lesson List + Assignments */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white border-r border-slate-100 overflow-y-auto shrink-0 flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-slate-900 text-sm">محتوى الكورس</h2>
                <p className="text-xs text-slate-500 mt-1">{lessons.length} درس</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-slate-50">
                    {lessons.map((lesson, index) => {
                    const isActive = index === currentLessonIndex;
                    const prog = progressData?.find((p: any) => p.lesson_id === lesson.id);
                    const isComplete = prog?.completed;
                    
                    const prevLesson = index > 0 ? lessons[index - 1] : null;
                    const prevProg = prevLesson ? progressData?.find((p: any) => p.lesson_id === prevLesson.id) : null;
                    const isLocked = index > 0 && !prevProg?.completed;

                    return (
                        <motion.button
                        key={lesson.id}
                        whileHover={!isLocked ? { x: -2 } : {}}
                        onClick={() => !isLocked && setCurrentLessonIndex(index)}
                        disabled={isLocked}
                        className={`w-full text-right flex items-center gap-3 p-4 transition-colors ${
                            isActive
                            ? 'bg-primary/5 border-r-4 border-primary'
                            : isLocked
                            ? 'opacity-40 cursor-not-allowed bg-slate-50'
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
                        <div className="flex-1 min-w-0 text-right">
                            <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                            {lesson.title}
                            </p>
                            {prog?.percent_watched > 0 && !isComplete && (
                            <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${prog.percent_watched}%` }} />
                            </div>
                            )}
                        </div>
                        </motion.button>
                    );
                    })}
                </div>

                {/* Assignments Section */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-primary" /> مهام الكورس
                    </h3>
                    <div className="space-y-2">
                        {course?.assignments?.length ? course.assignments.map((assignment: any) => (
                            <Link 
                                key={assignment.id} 
                                to="/assignments" 
                                className="block p-3 bg-white border border-slate-200 rounded-xl hover:border-primary transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-700 group-hover:text-primary truncate">{assignment.title}</p>
                                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] text-slate-400">آخر موعد: {new Date(assignment.deadline).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </Link>
                        )) : (
                            <p className="text-[10px] text-slate-400 text-center py-4">لا توجد مهام حالياً</p>
                        )}
                    </div>
                </div>

                {/* Assessments Section */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Link 
                        to="/assessments" 
                        className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-100 transition-all group"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-indigo-700" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-900">التقييمات والاختبارات</p>
                                <p className="text-[10px] text-indigo-700/70">أكمل التقييمات المتاحة</p>
                            </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    </Link>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursePlayer;
