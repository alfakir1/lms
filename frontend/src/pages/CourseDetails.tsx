import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Star, Clock, CheckCircle, Play, User, Calendar, Loader2 } from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [enrollMsg, setEnrollMsg] = useState('');

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    }
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      return await api.post(`/enrollments/courses/${id}`);
    },
    onSuccess: () => {
      setEnrollMsg('Enrollment request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
    onError: (err: any) => {
      setEnrollMsg(err.response?.data?.message || 'Enrollment failed.');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-text font-medium">Loading Course Details...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Course</h2>
        <p className="text-gray-600 mb-4">The course you are looking for may not exist or an error occurred.</p>
        <Link to="/courses" className="text-primary hover:underline">Back to All Courses</Link>
      </div>
    );
  }

  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary text-white rounded-full mb-2">
                  {course.category || 'Course'}
                </span>
                <span className={`inline-block ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level || 'All Levels'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-text mb-4">{course.title}</h1>

              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-text font-semibold ml-1">{course.rating || 'N/A'}</span>
                  <span className="text-gray-600 ml-1">({course.students_count || 0} students)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">{course.duration || 'Flexible'}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">Created by {course.instructor?.user?.name || 'Instructor'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">Last updated {new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-accent mb-2">${course.price}</div>
                  {course.originalPrice > course.price && (
                    <div className="text-lg text-gray-500 line-through">${course.originalPrice}</div>
                  )}
                </div>

                {enrollMsg && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${enrollMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {enrollMsg}
                  </div>
                )}

                {!course.is_enrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center disabled:opacity-50"
                  >
                    {enrollMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Enroll Now'}
                  </button>
                ) : (
                  <Link
                    to={`/student/courses/${course.id}/learn`}
                    className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-4 text-center block"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="space-y-3">
                  {(course.features || [
                    'Lifetime access to course materials',
                    'Certificate of completion',
                    'Mobile and desktop access'
                  ]).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-text">Build responsive websites using HTML and CSS</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-text">Create interactive web pages with JavaScript</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-text">Understand modern web development practices</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-text">Deploy websites to the internet</span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Course Content</h2>
              <div className="space-y-4">
                {(course.chapters || []).map((chapter: any, sectionIndex: number) => (
                  <div key={chapter.id || sectionIndex} className="border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                      <h3 className="font-semibold text-text">{chapter.title}</h3>
                      <span className="text-sm text-gray-600">{chapter.lectures?.length || 0} lessons</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {(chapter.lectures || []).map((lecture: any, lectureIndex: number) => (
                        <div key={lecture.id || lectureIndex} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <Play className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-text">{lecture.title}</span>
                          </div>
                          <span className="text-sm text-gray-600">{Math.floor(lecture.duration / 60)} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-text">• {course.requirements || 'Basic computer skills and internet access.'}</span>
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-text whitespace-pre-line">{course.long_description || course.description}</p>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Your Instructor</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {course.instructor?.user?.name?.charAt(0) || 'I'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text">{course.instructor?.user?.name || 'Instructor Name'}</h3>
                  <p className="text-gray-600 mb-2">{course.instructor?.title || 'Expert Instructor'}</p>
                  <p className="text-text mb-4">{course.instructor?.bio || 'Professional instructor with years of expertise.'}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Student Reviews</h2>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-semibold text-text mr-2">{review.user}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                    <p className="text-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text mb-4">Course Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text">Duration</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Level</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Language</span>
                  <span className="font-semibold">{course.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Students</span>
                  <span className="font-semibold">{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text">Last Updated</span>
                  <span className="font-semibold">{course.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;