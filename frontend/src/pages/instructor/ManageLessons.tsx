import React, { useState } from 'react';
import { Play, FileText, Plus, Trash2, GripVertical, Clock, Upload } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: string;
  order: number;
  content: string;
  completed: boolean;
}

const SortableLessonItem = ({ lesson, onDelete }: { lesson: Lesson, onDelete: (id: number) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`glass rounded-2xl p-6 ${isDragging ? 'shadow-2xl opacity-90 scale-[1.02]' : 'hover:-translate-y-1 hover:shadow-lg shadow-sm'} transition-all duration-300 relative bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Drag Handle */}
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
            <GripVertical className="h-5 w-5 text-slate-400" />
          </div>

          {/* Lesson Type Icon */}
          <div className="flex-shrink-0">
            {lesson.type === 'video' ? (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Play className="h-6 w-6 text-red-500 dark:text-red-400" />
              </div>
            ) : lesson.type === 'quiz' ? (
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
            ) : (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-text-h">{lesson.title}</h3>
              <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                {lesson.type}
              </span>
              <span className="text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Order: {lesson.order}</span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-3">{lesson.description}</p>

            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                <Clock className="h-4 w-4 mr-2 text-secondary" />
                <span className="font-medium">{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                <span className={`w-2 h-2 rounded-full inline-block ${lesson.completed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="font-medium">{lesson.completed ? 'Published' : 'Draft'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pl-4">
          <button
            onClick={() => onDelete(lesson.id)}
            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all shadow-sm"
            title="Delete Lesson"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: 'Introduction to HTML',
      description: 'Learn the basics of HTML and how to structure web pages.',
      duration: '15:30',
      type: 'video',
      order: 1,
      content: 'HTML content here...',
      completed: true
    },
    {
      id: 2,
      title: 'HTML Elements and Tags',
      description: 'Understanding different HTML elements and their purposes.',
      duration: '20:45',
      type: 'video',
      order: 2,
      content: 'HTML elements content...',
      completed: true
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        
        const rearranged = arrayMove(items, oldIndex, newIndex);
        return rearranged.map((lesson, idx) => ({ ...lesson, order: idx + 1 }));
      });
    }
  };

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  const handleDeleteLesson = (lessonId: number) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">Manage Lessons</h1>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">Course</span>
                Web Development Fundamentals
              </div>
            </div>
            <button
              onClick={handleAddLesson}
              className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Lesson</span>
            </button>
          </div>
        </div>

        {/* Lessons List (Drag and Drop Context) */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext 
              items={lessons.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {lessons.map((lesson) => (
                <SortableLessonItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  onDelete={handleDeleteLesson} 
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="text-center py-20 glass rounded-3xl mt-4">
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-h mb-3">No lessons yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">Your course is empty. Start building your curriculum by adding the first lesson.</p>
            <button
              onClick={handleAddLesson}
              className="inline-flex items-center bg-primary text-white px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-bold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Lesson
            </button>
          </div>
        )}

        {/* Add Lesson Modal */}
        {isAddingLesson && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="glass bg-white/95 dark:bg-slate-900/95 rounded-3xl p-8 w-full max-w-2xl mx-auto shadow-2xl border border-slate-200/60 dark:border-slate-700/60 transform transition-all">
              <h2 className="text-2xl font-bold text-text-h mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full block"></span>
                Create New Lesson
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-h mb-2">Lesson Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="e.g., Understanding CSS Grid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-h mb-2">Short Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Brief overview of what students will learn..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-h mb-2">Content Type</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none outline-none font-medium text-slate-700 dark:text-slate-300">
                        <option value="video">🎥 Video Lecture</option>
                        <option value="reading">📄 PDF / Reading</option>
                        <option value="quiz">📝 Quiz / Assessment</option>
                        <option value="assignment">📋 Assignment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-h mb-2">Estimated Duration</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="font-semibold text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    Save Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLessons;