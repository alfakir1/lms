import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { Plus, Trash2, Loader2, PlayCircle, Video } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';

const InstructorLectures: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('');
  
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: coursesData } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => courseService.getAll(),
  });
  const courses = coursesData?.data || [];

  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['course-chapters', selectedCourseId],
    queryFn: () => courseService.getChapters(selectedCourseId),
    enabled: !!selectedCourseId,
  });

  const { data: lectures, isLoading: isLoadingLectures } = useQuery({
    queryKey: ['chapter-lectures', selectedChapterId],
    queryFn: () => courseService.getLectures(selectedChapterId),
    enabled: !!selectedChapterId,
  });

  const createLectureMutation = useMutation({
    mutationFn: (data: any) => courseService.createLecture(selectedChapterId, data),
    onSuccess: () => {
      showSuccess('Lecture created successfully');
      setShowAddLecture(false);
      setLectureTitle('');
      setLectureVideoUrl('');
      queryClient.invalidateQueries({ queryKey: ['chapter-lectures', selectedChapterId] });
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to create lecture');
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: (id: number | string) => courseService.deleteLecture(id),
    onSuccess: () => {
      showSuccess('Lecture deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['chapter-lectures', selectedChapterId] });
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to delete lecture');
    },
  });

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !lectureVideoUrl.trim()) return;
    createLectureMutation.mutate({
      title: lectureTitle,
      video_url: lectureVideoUrl,
      type: 'video',
      order: (lectures?.length || 0) + 1,
      duration: 10, // placeholder
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="text-primary-600" />
              Manage Lectures
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Add and edit lectures for your course chapters.
            </p>
          </div>
        </div>

        <Card className="dark:bg-slate-900 mb-8 border border-slate-200 dark:border-slate-800 shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedChapterId('');
                  }}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {selectedCourseId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Chapter</label>
                  {isLoadingChapters ? (
                     <div className="py-3 px-4 text-slate-500">Loading chapters...</div>
                  ) : (
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                    >
                      <option value="">-- Choose Chapter --</option>
                      {chapters?.map((ch: any) => (
                        <option key={ch.id} value={ch.id}>{ch.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedChapterId && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lectures</h2>
              <Button onClick={() => setShowAddLecture(!showAddLecture)}>
                {showAddLecture ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Add Lecture</>}
              </Button>
            </div>

            {showAddLecture && (
              <Card className="dark:bg-slate-900 mb-8 border border-primary-200 dark:border-primary-800 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">New Lecture</h3>
                  <form onSubmit={handleCreateLecture} className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lecture Title</label>
                      <input
                        type="text"
                        required
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                        placeholder="E.g., Introduction to the framework"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video URL / Key</label>
                      <input
                        type="text"
                        required
                        value={lectureVideoUrl}
                        onChange={(e) => setLectureVideoUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                        placeholder="E.g., URL or Video ID"
                      />
                    </div>
                    <Button type="submit" isLoading={createLectureMutation.isPending}>
                      Save Lecture
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {isLoadingLectures ? (
              <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-primary-600 animate-spin" /></div>
            ) : lectures && lectures.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {lectures.map((l: any) => (
                        <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-5 w-5 text-primary-500" />
                              <div className="font-semibold text-slate-900 dark:text-white">{l.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase">
                            {l.type}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if(window.confirm('Are you sure you want to delete this lecture?')) {
                                  deleteLectureMutation.mutate(l.id);
                                }
                              }}
                              disabled={deleteLectureMutation.isPending && deleteLectureMutation.variables === l.id}
                              className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleteLectureMutation.isPending && deleteLectureMutation.variables === l.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <Video className="h-16 w-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No lectures</h3>
                <p className="text-slate-500 dark:text-slate-400">Add your first lecture to this chapter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorLectures;
