import React, { useState } from 'react';
import { Play, FileText, Plus, Trash2, GripVertical, Clock, Upload } from 'lucide-react';

const ManageLessons: React.FC = () => {
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Manage Lessons</h1>
            <p className="text-gray-600">Course: Web Development Fundamentals</p>
          </div>
          <button
            onClick={handleAddLesson}
            className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Lesson</span>
          </button>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Drag Handle */}
                  <div className="cursor-move">
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
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-primary">{lesson.title}</h3>
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                        {lesson.type}
                      </span>
                      <span className="text-sm text-gray-600">Order: {lesson.order}</span>
                    </div>

                    <p className="text-text mb-3">{lesson.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div>
                        <span>Status: {lesson.completed ? 'Published' : 'Draft'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lesson Content Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-text mb-2">Content Preview</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{lesson.content}</p>
                  {lesson.type === 'video' && (
                    <div className="mt-3">
                      <button className="flex items-center space-x-2 text-secondary hover:text-primary text-sm">
                        <Upload className="h-4 w-4" />
                        <span>Upload Video</span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h2 className="text-xl font-bold text-text mb-6">Add New Lesson</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Lesson Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter lesson description"
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="video">Video</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                      <option value="reading">Reading</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Duration</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Content</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter lesson content or instructions"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="border border-gray-300 text-text px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No lessons yet</h3>
            <p className="text-gray-600 mb-4">Start building your course by adding your first lesson.</p>
            <button
              onClick={handleAddLesson}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLessons;