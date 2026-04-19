import React, { useState } from 'react';
import { BookOpen, Search, Filter, Eye, Edit, Trash2, MoreVertical, Users, Star, DollarSign, Clock } from 'lucide-react';

const CoursesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      instructor: 'John Doe',
      category: 'Programming',
      status: 'published',
      students: 234,
      rating: 4.8,
      price: 99,
      duration: '8 weeks',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-15',
      thumbnail: null
    },
    {
      id: 2,
      title: 'React for Beginners',
      instructor: 'Jane Smith',
      category: 'Programming',
      status: 'published',
      students: 189,
      rating: 4.7,
      price: 79,
      duration: '6 weeks',
      createdDate: '2023-12-15',
      lastUpdated: '2024-01-10',
      thumbnail: null
    },
    {
      id: 3,
      title: 'Python Programming',
      instructor: 'Mike Johnson',
      category: 'Programming',
      status: 'draft',
      students: 0,
      rating: 0,
      price: 89,
      duration: '10 weeks',
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-05',
      thumbnail: null
    },
    {
      id: 4,
      title: 'Data Science with Python',
      instructor: 'Sarah Wilson',
      category: 'Data Science',
      status: 'published',
      students: 156,
      rating: 4.9,
      price: 149,
      duration: '12 weeks',
      createdDate: '2023-11-20',
      lastUpdated: '2024-01-08',
      thumbnail: null
    },
    {
      id: 5,
      title: 'UI/UX Design Principles',
      instructor: 'David Brown',
      category: 'Design',
      status: 'review',
      students: 0,
      rating: 0,
      price: 119,
      duration: '8 weeks',
      createdDate: '2024-01-12',
      lastUpdated: '2024-01-12',
      thumbnail: null
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter || course.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return 'bg-blue-100 text-blue-800';
      case 'data science':
        return 'bg-purple-100 text-purple-800';
      case 'design':
        return 'bg-pink-100 text-pink-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on courses:`, selectedCourses);
    // In real app, this would call API
    setSelectedCourses([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Courses Management</h1>
            <p className="text-gray-600">Manage all courses, content, and publishing</p>
          </div>
          <button className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {courses.filter(c => c.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {courses.filter(c => c.status === 'draft' || c.status === 'review').length}
            </div>
            <div className="text-sm text-gray-600">In Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {courses.reduce((sum, c) => sum + c.students, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses by title, instructor, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="programming">Programming</option>
                <option value="data science">Data Science</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCourses.length > 0 && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => handleBulkAction('publish')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                Unpublish
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Course Thumbnail */}
              <div className="h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-primary line-clamp-2">{course.title}</h3>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleSelectCourse(course.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>

                <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>

                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span>{course.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                    <span>${course.price}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Created: {course.createdDate} | Updated: {course.lastUpdated}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCourses.length}</span> of{' '}
              <span className="font-medium">{filteredCourses.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-900">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;