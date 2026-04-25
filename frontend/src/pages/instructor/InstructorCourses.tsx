import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { BookOpen, Search, Plus, Trash2, Loader2, Eye } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner, ErrorMessage } from '../../components/ui/Feedback';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const InstructorCourses: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('0');

  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['instructor-courses', searchTerm],
    queryFn: () => courseService.getAll({ search: searchTerm }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => courseService.create(data),
    onSuccess: () => {
      showSuccess('Course created successfully');
      setShowCreateForm(false);
      setNewCourseTitle('');
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to create course');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      showSuccess('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to delete course');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <LoadingSpinner text={t('common.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full">
          <ErrorMessage 
            title="Error Loading Courses" 
            message="Unable to fetch course data. Please try again." 
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })} 
          />
        </div>
      </div>
    );
  }

  const courses = coursesData?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    createMutation.mutate({ title: newCourseTitle, price: Number(newCoursePrice) || 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="text-primary-600" />
              {t('instructor.myCourses') || 'My Courses'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {t('instructor.manageCoursesSubtitle') || 'Create, update, or delete your courses.'}
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            {showCreateForm ? 'Cancel' : <><Plus className="h-4 w-4" /> {t('instructor.createNewCourse') || 'Create New Course'}</>}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="dark:bg-slate-900 mb-8 border border-primary-200 dark:border-primary-800 shadow-soft">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Course</h2>
              <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                    placeholder="E.g., Advanced React Patterns"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                  />
                </div>
                <Button type="submit" isLoading={createMutation.isPending} className="w-full sm:w-auto">
                  Save Course
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <div className="relative max-w-lg">
            <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('courses.search') || 'Search your courses...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      ${Number(course.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          course.status === 'published' ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400' :
                          'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {course.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 
                           In a fully built system, 'Edit' would go to a detailed course builder page.
                           For this requirement, we show basic actions.
                        */}
                        <Link to={`/courses/${course.id}`} className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors" title="View Public Page">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this course?')) {
                              deleteMutation.mutate(course.id);
                            }
                          }}
                          disabled={deleteMutation.isPending && deleteMutation.variables === course.id}
                          className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === course.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-slate-500 dark:text-slate-400">Click the 'Create New Course' button to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;
