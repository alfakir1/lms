import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, FileText, Plus, Trash2, GripVertical, Clock, Upload } from 'lucide-react';

const ManageLessons: React.FC = () => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to HTML',
      description: 'Learn the basics of HTML and how to structure web pages.',
      duration: '15:30',
      type: 'video',
      order: 1,
      content: 'HTML content here...',
      completed: false
    },
    {
      id: 2,
      title: 'HTML Elements and Tags',
      description: 'Understanding different HTML elements and their purposes.',
      duration: '20:45',
      type: 'video',
      order: 2,
      content: 'HTML elements content...',
      completed: false
    },
    {
      id: 3,
      title: 'HTML Quiz',
      description: 'Test your knowledge of HTML basics.',
      duration: '10:00',
      type: 'quiz',
      order: 3,
      content: 'Quiz questions...',
      completed: false
    }
  ]);

  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  const handleDeleteLesson = (lessonId: number) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold text-text dark:text-white mb-2">{t('instructor.manageLessons', 'Manage Lessons')}</h1>
            <p className="text-gray-600 dark:text-slate-400">{t('common.course', 'Course')}: Web Development Fundamentals</p>
          </div>
          <button
            onClick={handleAddLesson}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            <Plus className="h-5 w-5" />
            <span>{t('instructor.addLesson', 'Add Lesson')}</span>
          </button>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <div className="flex items-center space-x-4 rtl:space-x-reverse flex-1">
                  {/* Drag Handle */}
                  <div className="cursor-move flex-shrink-0">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Lesson Type Icon */}
                  <div className="flex-shrink-0">
                    {lesson.type === 'video' ? (
                      <Play className="h-8 w-8 text-red-500" />
                    ) : lesson.type === 'quiz' ? (
                      <FileText className="h-8 w-8 text-blue-500" />
                    ) : (
                      <FileText className="h-8 w-8 text-green-500" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 rtl:text-right">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                      <h3 className="text-lg font-semibold text-primary dark:text-secondary">{lesson.title}</h3>
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300 rounded-full">
                        {t(`common.${lesson.type}`, lesson.type)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-slate-400">{t('common.order', 'Order')}: {lesson.order}</span>
                    </div>

                    <p className="text-text dark:text-slate-300 mb-3">{lesson.description}</p>

                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600 dark:text-slate-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div>
                        <span>{t('common.status', 'Status')}: {lesson.completed ? t('common.published', 'Published') : t('common.draft', 'Draft')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lesson Content Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-text dark:text-white mb-2 rtl:text-right">{t('instructor.contentPreview', 'Content Preview')}</h4>
                  <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3 rtl:text-right">{lesson.content}</p>
                  {lesson.type === 'video' && (
                    <div className="mt-3 rtl:text-right">
                      <button className="flex items-center space-x-2 rtl:space-x-reverse text-secondary hover:text-primary text-sm font-bold">
                        <Upload className="h-4 w-4" />
                        <span>{t('instructor.uploadVideo', 'Upload Video')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Lesson Modal/Form */}
        {isAddingLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-neutral-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-text dark:text-white mb-6 rtl:text-right">{t('instructor.addNewLesson', 'Add New Lesson')}</h2>

              <form className="space-y-6">
                <div className="rtl:text-right">
                  <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('instructor.lessonTitle', 'Lesson Title')}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder={t('instructor.enterLessonTitle', 'Enter lesson title')}
                  />
                </div>

                <div className="rtl:text-right">
                  <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('common.description')}</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder={t('instructor.enterLessonDesc', 'Enter lesson description')}
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rtl:text-right">
                    <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('common.type')}</label>
                    <select className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                      <option value="video">{t('common.video')}</option>
                      <option value="quiz">{t('common.quiz')}</option>
                      <option value="assignment">{t('common.assignment')}</option>
                      <option value="reading">{t('common.reading', 'Reading')}</option>
                    </select>
                  </div>

                  <div className="rtl:text-right">
                    <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('courses.duration')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </div>

                <div className="rtl:text-right">
                  <label className="block text-sm font-bold text-text dark:text-white mb-2">{t('common.content', 'Content')}</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder={t('instructor.enterLessonContent', 'Enter lesson content or instructions')}
                  ></textarea>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse pt-4">
                  <button
                    type="submit"
                    className="bg-secondary text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold"
                  >
                    {t('instructor.addLesson')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="border border-gray-300 dark:border-slate-700 text-text dark:text-white px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-bold"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text dark:text-white mb-2">{t('instructor.noLessons', 'No lessons yet')}</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-8">{t('instructor.noLessonsSubtitle', 'Start building your course by adding your first lesson.')}</p>
            <button
              onClick={handleAddLesson}
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-glow transition-all"
            >
              <Plus className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('instructor.addFirstLesson', 'Add Your First Lesson')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLessons;