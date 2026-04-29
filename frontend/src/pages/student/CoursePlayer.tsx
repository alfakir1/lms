import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { useToast } from '../../contexts/ToastContext';
import type { Lecture } from '../../types';
import { useLang } from '../../context/LangContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface LectureWithChapter extends Lecture {
  chapterTitle?: string;
  chapterId?: number;
}

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();
  const { lang, dir } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentLectureId, setCurrentLectureId] = useState<number | null>(null);
  const [, setVideoProgress] = useState(0);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Fetch course
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getById(courseId!),
    enabled: !!courseId,
  });

  // Fetch user's enrollment for this course
  const { data: myEnrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  const myEnrollment = myEnrollments?.find(e => e.course_id === Number(courseId));
  const isEnrolled = !!myEnrollment && myEnrollment.status === 'active';
  const enrollmentProgress = myEnrollment?.progress_percent || 0;

  // Fetch chapters with lectures
  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['course-chapters', courseId],
    queryFn: () => courseService.getChapters(courseId!),
    enabled: !!courseId && isEnrolled,
  });

  // Flatten lectures for the sidebar
  const allLectures: LectureWithChapter[] = React.useMemo(() => {
    if (!chapters) return [];
    return chapters.flatMap((chapter: any) =>
      (chapter.lectures || []).map((lecture: any) => ({
        ...lecture,
        chapterTitle: chapter.title,
        chapterId: chapter.id,
      }))
    );
  }, [chapters]);

  // Get current lecture
  const currentLecture = allLectures.find((l) => l.id === currentLectureId) || allLectures[0];

  const completedLectures = allLectures.filter((l) => {
    // This is a placeholder logic, in a real app you'd check a progress record
    const currentIndex = allLectures.findIndex(al => al.id === currentLectureId);
    const lectureIndex = allLectures.findIndex(al => al.id === l.id);
    return lectureIndex < currentIndex;
  }).length;

  // Track progress mutation
  const progressMutation = useMutation({
    mutationFn: ({ lectureId, payload }: { lectureId: number; payload: { watch_time: number; last_position: number } }) =>
      courseService.trackProgress(lectureId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
  });

  // Check enrollment and set initial lecture
  useEffect(() => {
    if (!course) return;
    if (!isEnrolled) {
      setShowAccessDenied(true);
      return;
    }
    const lectureIdFromUrl = searchParams.get('lecture');
    if (lectureIdFromUrl) {
      setCurrentLectureId(Number(lectureIdFromUrl));
    } else if (allLectures.length > 0 && !currentLectureId) {
      setCurrentLectureId(allLectures[0].id);
    }
  }, [course, isEnrolled, searchParams, allLectures]);

  // Handle video time update
  const handleTimeUpdate = () => {
    if (!videoRef.current || !currentLecture) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setVideoProgress(progress);
    if (progress > 0 && Math.floor(progress) % 10 === 0) {
      progressMutation.mutate({
        lectureId: currentLecture.id,
        payload: { watch_time: videoRef.current.currentTime, last_position: videoRef.current.currentTime },
      });
    }
  };

  // Handle lecture completion
  const handleCompleteLecture = () => {
    if (!currentLecture || !videoRef.current) return;
    progressMutation.mutate(
      { lectureId: currentLecture.id, payload: { watch_time: videoRef.current.duration, last_position: videoRef.current.duration } },
      {
        onSuccess: () => {
          showSuccess(lang === 'ar' ? 'تم إكمال الدرس!' : 'Lecture completed!');
          const currentIndex = allLectures.findIndex((l) => l.id === currentLectureId);
          if (currentIndex < allLectures.length - 1) {
            const nextLecture = allLectures[currentIndex + 1];
            setCurrentLectureId(nextLecture.id);
          }
        },
      }
    );
  };

  if (courseLoading || chaptersLoading) return <LoadingSpinner />;

  if (showAccessDenied || courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full glass-card p-10 rounded-3xl text-center border border-white/10">
          <span className="material-symbols-outlined text-[64px] text-red-500 mb-6">lock</span>
          <h2 className="text-3xl font-bold text-white mb-4">{lang === 'ar' ? 'الوصول محظور' : 'Access Denied'}</h2>
          <p className="text-slate-400 mb-8">{lang === 'ar' ? 'يجب عليك التسجيل في هذه الدورة للوصول إلى المحتوى.' : 'You need to enroll in this course to access the content.'}</p>
          <Link to={`/courses/${courseId}`} className="block w-full bg-primary-container text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
            {lang === 'ar' ? 'سجل الآن' : 'Enroll Now'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-manrope selection:bg-primary-container/30" dir={dir}>
      {/* Upper Navigation / Status Bar */}
      <nav className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/student/dashboard" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <span className="material-symbols-outlined text-slate-300">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white truncate max-w-[400px] leading-tight">{course?.title}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {currentLecture?.chapterTitle} • {allLectures.findIndex(l => l.id === currentLectureId) + 1} / {allLectures.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400">{lang === 'ar' ? 'تقدمك في الدورة' : 'Course Progress'}</p>
            <p className="text-sm font-black text-emerald-400">{enrollmentProgress}%</p>
          </div>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${enrollmentProgress}%` }} />
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] overflow-hidden">
        {/* Main Content: Cinema Player Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <div className="max-w-[1200px] mx-auto">
            {/* Player Shell */}
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 mb-10 group">
              {currentLecture?.content_url ? (
                <video
                  ref={videoRef}
                  src={currentLecture.content_url}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  controls
                  controlsList="nodownload"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <span className="material-symbols-outlined text-[80px] text-slate-800 mb-6">video_library</span>
                  <h3 className="text-2xl font-bold text-slate-600 mb-2">{lang === 'ar' ? 'المحتوى غير متوفر' : 'Content Unavailable'}</h3>
                  <p className="text-slate-700 max-w-sm">{lang === 'ar' ? 'المحاضر لم يقم برفع الفيديو لهذا الدرس بعد.' : 'The instructor has not uploaded the video for this lecture yet.'}</p>
                </div>
              )}
              
              {/* Floating Done Button overlay when video ends could go here */}
            </div>

            {/* Lecture Details */}
            <div className="glass-card p-10 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <span className="material-symbols-outlined text-[120px]">description</span>
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary-container/20 text-primary-container rounded-lg text-xs font-bold uppercase tracking-widest">
                        {currentLecture?.content_type || 'Lecture'}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {currentLecture?.duration || 0} {lang === 'ar' ? 'دقيقة' : 'min'}
                      </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-4">{currentLecture?.title}</h2>
                    <p className="text-slate-400 leading-relaxed max-w-2xl font-medium">
                      {lang === 'ar' 
                        ? 'في هذا الدرس سنتعرف على المفاهيم الأساسية والتقنيات المستخدمة في هذا المجال بشكل عملي وتطبيقي.' 
                        : 'In this lecture, we will learn about the basic concepts and techniques used in this field in a practical and applied manner.'}
                    </p>
                  </div>
                  <button 
                    onClick={handleCompleteLecture}
                    disabled={progressMutation.isPending}
                    className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    <span className="material-symbols-outlined">task_alt</span>
                    {lang === 'ar' ? 'تحديد كمكتمل' : 'Mark as Completed'}
                  </button>
               </div>
            </div>
          </div>
        </main>

        {/* Sidebar: Curriculum */}
        <aside className="w-full lg:w-[400px] h-full bg-slate-900 border-l border-white/5 flex flex-col">
          <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-2">{lang === 'ar' ? 'منهج الدورة' : 'Course Curriculum'}</h3>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>{allLectures.length} {lang === 'ar' ? 'دروس' : 'Lessons'}</span>
              <span>{completedLectures} {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
            {chapters?.map((chapter, cIdx) => (
              <div key={chapter.id} className="border-b border-white/5 last:border-none">
                <div className="px-8 py-5 bg-white/5 flex items-center justify-between group cursor-pointer">
                  <h4 className="text-sm font-bold text-slate-300">
                    <span className="text-primary-container mr-2">{(cIdx + 1).toString().padStart(2, '0')}.</span>
                    {chapter.title}
                  </h4>
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 transition-colors">expand_more</span>
                </div>
                <div>
                  {(chapter.lectures || []).map((lecture: any) => {
                    const isCurrent = lecture.id === currentLectureId;
                    return (
                      <button
                        key={lecture.id}
                        onClick={() => setCurrentLectureId(lecture.id)}
                        className={`w-full px-10 py-5 flex items-start gap-4 transition-all border-l-4 ${
                          isCurrent 
                            ? 'bg-primary-container/10 border-primary-container' 
                            : 'hover:bg-white/5 border-transparent'
                        }`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isCurrent ? 'bg-primary-container text-white' : 'bg-slate-800 text-slate-600'
                        }`}>
                          <span className="material-symbols-outlined text-xs">{isCurrent ? 'play_arrow' : 'play_circle'}</span>
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                            {lecture.title}
                          </p>
                          <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">
                            {lecture.duration || 0} {lang === 'ar' ? 'دقيقة' : 'MIN'}
                          </p>
                        </div>
                        {isCurrent && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
