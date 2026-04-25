import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Play, CheckCircle, Clock, ChevronLeft, Lock,
  AlertCircle, Loader2
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { useToast } from '../../contexts/ToastContext';
import type { Lecture } from '../../types';

interface LectureWithChapter extends Lecture {
  chapterTitle?: string;
  chapterId?: number;
}

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();
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
    return chapters.flatMap((chapter) =>
      (chapter.lectures || []).map((lecture) => ({
        ...lecture,
        chapterTitle: chapter.title,
        chapterId: chapter.id,
      }))
    );
  }, [chapters]);

  // Get current lecture
  const currentLecture = allLectures.find((l) => l.id === currentLectureId) || allLectures[0];

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

    // Check if enrolled
    if (!isEnrolled) {
      setShowAccessDenied(true);
      return;
    }

    // Set initial lecture from URL or first lecture
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

    // Track progress every 10%
    if (progress > 0 && Math.floor(progress) % 10 === 0) {
      progressMutation.mutate({
        lectureId: currentLecture.id,
        payload: {
          watch_time: videoRef.current.currentTime,
          last_position: videoRef.current.currentTime,
        },
      });
    }
  };

  // Handle lecture completion
  const handleCompleteLecture = () => {
    if (!currentLecture || !videoRef.current) return;

    progressMutation.mutate(
      {
        lectureId: currentLecture.id,
        payload: {
          watch_time: videoRef.current.duration,
          last_position: videoRef.current.duration,
        },
      },
      {
        onSuccess: () => {
          showSuccess('Lecture completed!');
          // Auto-advance to next lecture
          const currentIndex = allLectures.findIndex((l) => l.id === currentLectureId);
          if (currentIndex < allLectures.length - 1) {
            const nextLecture = allLectures[currentIndex + 1];
            setCurrentLectureId(nextLecture.id);
          }
        },
      }
    );
  };

  // Handle lecture click
  const handleLectureClick = (lecture: LectureWithChapter) => {
    if (isEnrolled) {
      setCurrentLectureId(lecture.id);
      setVideoProgress(0);
    }
  };

  // Loading state
  if (courseLoading || chaptersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-slate-700">Loading course...</span>
      </div>
    );
  }

  // Access denied state
  if (showAccessDenied || courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            You need to enroll in this course to access the content.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/courses/${courseId}`}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Enroll Now
            </Link>
            <Link
              to="/courses"
              className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Course not found</h2>
          <Link to="/courses" className="text-primary-600 hover:underline">
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  const completedLectures = allLectures.filter((l) => l.id <= (currentLectureId || 0)).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link
                to="/student/courses"
                className="text-sm text-slate-500 hover:text-primary-600 flex items-center gap-1 mb-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to My Courses
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-500 mt-1">
                by {course.instructor?.user?.name || 'Instructor'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-1">
                Course Progress: <span className="font-semibold text-primary-600">{enrollmentProgress}%</span>
              </div>
              <div className="w-48 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${enrollmentProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative">
              {currentLecture?.content_url && currentLecture.content_type === 'video' ? (
                <video
                  ref={videoRef}
                  src={currentLecture.content_url}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => {}}
                  onPause={() => {}}
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      {currentLecture?.content_type === 'video'
                        ? 'Video content not available'
                        : 'Content not available'}
                    </p>
                    <p className="text-sm opacity-75 mt-2">The instructor hasn\'t uploaded the content yet.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Info */}
            {currentLecture && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{currentLecture.chapterTitle}</span>
                      <Clock className="h-4 w-4" />
                      <span>{currentLecture.duration || 0} min</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{currentLecture.title}</h2>
                  </div>
                  <button
                    onClick={handleCompleteLecture}
                    disabled={progressMutation.isPending}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {progressMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Mark Complete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Curriculum */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-6 max-h-[calc(100vh-6rem)] flex flex-col">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Course Content</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {completedLectures} / {allLectures.length} lectures
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {chapters?.map((chapter) => (
                  <div key={chapter.id}>
                    <div className="px-4 py-3 bg-slate-50 border-y border-slate-100">
                      <h4 className="font-medium text-sm text-slate-700">{chapter.title}</h4>
                    </div>
                    {(chapter.lectures || []).map((lecture) => {
                      const isCurrent = lecture.id === currentLectureId;

                      return (
                        <button
                          key={lecture.id}
                          onClick={() => handleLectureClick({ ...lecture, chapterTitle: chapter.title, chapterId: chapter.id })}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                            isCurrent
                              ? 'bg-primary-50 border-l-4 border-primary-600'
                              : 'hover:bg-slate-50 border-l-4 border-transparent'
                          } cursor-pointer`}
                        >
                          <Play className={`h-4 w-4 flex-shrink-0 ${isCurrent ? 'text-primary-600' : 'text-slate-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary-900' : 'text-slate-700'}`}>
                              {lecture.title}
                            </p>
                            <p className="text-xs text-slate-500">{lecture.duration || 0} min</p>
                          </div>
                          {isCurrent && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {(!chapters || chapters.length === 0) && (
                  <div className="p-8 text-center text-slate-500">
                    <p>No content available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
