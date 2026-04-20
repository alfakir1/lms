import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, CheckCircle, Clock, FileText, MessageCircle } from 'lucide-react';

const CoursePlayer: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load persistence from local storage
  useEffect(() => {
    const savedLesson = localStorage.getItem('coursePlayer_currentLesson');
    if (savedLesson) setCurrentLesson(parseInt(savedLesson, 10));
    
    // Simulate real progress fetching
    setTimeout(() => setProgress(35), 500);
  }, []);

  useEffect(() => {
    localStorage.setItem('coursePlayer_currentLesson', String(currentLesson));
  }, [currentLesson]);

  // Mock course data
  const course = {
    id: 1,
    title: 'Web Development Fundamentals',
    instructor: 'Sarah Johnson',
    currentLesson: {
      id: 1,
      title: 'Introduction to HTML',
      duration: '15:30',
      description: 'Learn the basics of HTML and how to structure web pages.',
      videoUrl: '/api/placeholder/video',
      completed: false
    },
    lessons: [
      { id: 1, title: 'Introduction to HTML', duration: '15:30', completed: true },
      { id: 2, title: 'HTML Elements and Tags', duration: '20:45', completed: true },
      { id: 3, title: 'Creating Your First Webpage', duration: '18:20', completed: false },
      { id: 4, title: 'HTML Forms', duration: '25:10', completed: false },
      { id: 5, title: 'Semantic HTML', duration: '22:15', completed: false }
    ],
    progress: 35,
    totalLessons: 24,
    completedLessons: 8
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleCompleteLesson = () => {
    // Mark lesson as completed
    console.log('Lesson completed');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="glass rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="flex items-center justify-between">
            <div>
              <Link to="/student/courses" className="text-secondary hover:text-primary text-sm mb-3 inline-flex items-center font-medium transition-colors">
                <span className="mr-2">←</span> Back to My Courses
              </Link>
              <h1 className="text-3xl font-black text-text-h relative z-10">{course.title}</h1>
              <p className="text-slate-500 font-medium relative z-10 text-lg">by <span className="text-primary">{course.instructor}</span></p>
            </div>
            <div className="text-right glass bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl relative z-10 border border-white/60 dark:border-slate-700/60 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl relative group">
              {/* Video Placeholder */}
              <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-xl">Video Player</p>
                  <p className="text-sm opacity-75">Lesson: {course.currentLesson.title}</p>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div
                        className="bg-accent h-1 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-accent">
                        <SkipBack className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handlePlayPause}
                        className="bg-white text-black rounded-full p-2 hover:bg-accent hover:text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <button className="text-white hover:text-accent">
                        <SkipForward className="h-6 w-6" />
                      </button>
                      <span className="text-white text-sm">2:35 / 15:30</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:text-accent"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <div className="w-20 bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-accent h-1 rounded-full"
                            style={{ width: `${isMuted ? 0 : volume}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="text-white hover:text-accent">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="glass rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-h flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full block"></span>
                  {course.currentLesson.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.currentLesson.duration}</span>
                </div>
              </div>

              <p className="text-text mb-6">{course.currentLesson.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-secondary hover:text-primary">
                    <FileText className="h-4 w-4" />
                    <span>Resources</span>
                  </button>
                  <button className="flex items-center space-x-2 text-secondary hover:text-primary">
                    <MessageCircle className="h-4 w-4" />
                    <span>Discussion</span>
                  </button>
                </div>

                <button
                  onClick={handleCompleteLesson}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 font-bold"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Mark as Complete</span>
                </button>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="glass rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-text-h mb-6">Lesson Material</h3>
              <div className="prose max-w-none">
                <p className="mb-4">
                  Welcome to the introduction to HTML! In this lesson, we'll cover the fundamental building blocks
                  of web development. HTML (HyperText Markup Language) is the standard markup language for creating
                  web pages and web applications.
                </p>

                <h4 className="font-semibold mb-2">What you'll learn:</h4>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>The basic structure of an HTML document</li>
                  <li>Common HTML elements and their purposes</li>
                  <li>How to create your first HTML page</li>
                  <li>Best practices for writing clean HTML code</li>
                </ul>

                <h4 className="font-semibold mb-2">Key Concepts:</h4>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <pre className="text-sm">
{`<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`}
                  </pre>
                </div>

                <p>
                  Remember to practice what you've learned by creating your own HTML files.
                  The more you practice, the better you'll understand these concepts.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl shadow-sm p-6 sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
              <h3 className="text-xl font-bold text-text-h mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">Curriculum</h3>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLesson === lesson.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        currentLesson === lesson.id ? 'text-white' : 'text-text'
                      }`}>
                        {index + 1}. {lesson.title}
                      </span>
                      {lesson.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        currentLesson === lesson.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {lesson.duration}
                      </span>
                      {currentLesson === lesson.id && (
                        <span className="text-xs text-blue-100">Current</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Progress */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Course Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;