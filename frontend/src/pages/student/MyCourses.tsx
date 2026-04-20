import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Play, CheckCircle, Star, Search } from 'lucide-react';

const MyCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const enrolledCourses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 75,
      status: 'in-progress',
      enrolledDate: '2024-01-01',
      totalLessons: 24,
      completedLessons: 18,
      duration: '8 hours',
      rating: 4.8,
      nextLesson: 'CSS Flexbox and Grid',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'React for Beginners',
      instructor: 'Mike Chen',
      progress: 45,
      status: 'in-progress',
      enrolledDate: '2024-01-05',
      totalLessons: 32,
      completedLessons: 14,
      duration: '12 hours',
      rating: 4.9,
      nextLesson: 'Components and Props',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Python Programming',
      instructor: 'David Wilson',
      progress: 100,
      status: 'completed',
      enrolledDate: '2023-12-15',
      totalLessons: 28,
      completedLessons: 28,
      duration: '15 hours',
      rating: 4.7,
      certificateEarned: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Data Science with Python',
      instructor: 'Lisa Rodriguez',
      progress: 0,
      status: 'not-started',
      enrolledDate: '2024-01-10',
      totalLessons: 40,
      completedLessons: 0,
      duration: '20 hours',
      rating: 4.6,
      nextLesson: 'Introduction to Data Science',
      image: '/api/placeholder/300/200'
    }
  ];

  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'in-progress' && course.status === 'in-progress') ||
                         (filter === 'completed' && course.status === 'completed') ||
                         (filter === 'not-started' && course.status === 'not-started');
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">My Courses</h1>
          <p className="text-gray-600">Track your learning progress and continue your courses</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-text">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Courses</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{enrolledCourses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {enrolledCourses.filter(c => c.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {enrolledCourses.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {enrolledCourses.filter(c => c.certificateEarned).length}
            </div>
            <div className="text-sm text-gray-600">Certificates</div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Course Header */}
              <div className="h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <div className="text-white text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm opacity-90">{course.title}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-primary line-clamp-1">{course.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>

                <p className="text-text mb-3">Instructor: {course.instructor}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-accent mr-1" />
                    <span>{course.certificateEarned ? 'Certificate earned' : 'Certificate pending'}</span>
                  </div>
                </div>

                {/* Next Lesson */}
                {course.nextLesson && (
                  <div className="bg-background rounded-lg p-3 mb-4">
                    <p className="text-sm text-text">
                      <span className="font-medium">Next:</span> {course.nextLesson}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/student/courses/${course.id}/learn`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>{course.status === 'not-started' ? 'Start Course' : 'Continue Learning'}</span>
                  </Link>
                  {course.certificateEarned && (
                    <Link
                      to={`/student/certificates`}
                      className="flex items-center justify-center space-x-2 bg-accent text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Award className="h-4 w-4" />
                      <span>Certificate</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-text mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
            <Link
              to="/courses"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Browse New Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;