import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, DollarSign, Edit, Trash2, Plus, Eye, Settings } from 'lucide-react';

const ManageCourses: React.FC = () => {
  const [filter, setFilter] = useState('all');

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript to build modern websites from scratch.',
      students: 234,
      rating: 4.9,
      price: 99,
      status: 'published',
      enrolled: 234,
      revenue: 23166,
      lastUpdated: '2024-01-15',
      category: 'Web Development',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'React for Beginners',
      description: 'Master React.js and build interactive user interfaces with modern hooks.',
      students: 189,
      rating: 4.7,
      price: 149,
      status: 'published',
      enrolled: 189,
      revenue: 28161,
      lastUpdated: '2024-01-10',
      category: 'Web Development',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Python Programming Complete Guide',
      description: 'Complete guide to Python programming from basics to advanced concepts.',
      students: 0,
      rating: 0,
      price: 129,
      status: 'draft',
      enrolled: 0,
      revenue: 0,
      lastUpdated: '2024-01-12',
      category: 'Programming',
      level: 'All Levels'
    },
    {
      id: 4,
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning with Python.',
      students: 156,
      rating: 4.8,
      price: 199,
      status: 'published',
      enrolled: 156,
      revenue: 31044,
      lastUpdated: '2024-01-08',
      category: 'Data Science',
      level: 'Advanced'
    }
  ];

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    // In real app, this would show a confirmation dialog and delete the course
    console.log('Delete course:', courseId);
  };

  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const publishedCourses = courses.filter(c => c.status === 'published').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Manage Courses</h1>
            <p className="text-gray-600">Create and manage your courses</p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{publishedCourses}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text">Filter by status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-primary">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>

                  <p className="text-text mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.category}</span>
                    </div>
                    <div>
                      <span>Level: {course.level}</span>
                    </div>
                    <div>
                      <span>Last updated: {course.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-accent mb-1">${course.price}</div>
                  <div className="text-sm text-gray-500">Price</div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-lg font-semibold text-text">{course.students}</div>
                  <div className="text-xs text-gray-600">Students</div>
                </div>

                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-lg font-semibold text-text">{course.rating || 'N/A'}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>

                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-lg font-semibold text-text">${course.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>

                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-lg font-semibold text-text">{course.enrolled}</div>
                  <div className="text-xs text-gray-600">Enrolled</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Link
                    to={`/instructor/courses/${course.id}/lessons`}
                    className="flex items-center space-x-2 text-secondary hover:text-primary text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Lessons</span>
                  </Link>
                  <Link
                    to={`/instructor/courses/${course.id}/students`}
                    className="flex items-center space-x-2 text-secondary hover:text-primary text-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span>View Students</span>
                  </Link>
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex items-center space-x-2 text-secondary hover:text-primary text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview Course</span>
                  </Link>
                </div>

                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 text-secondary hover:text-primary text-sm">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
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
            <p className="text-gray-600 mb-4">Try adjusting your filter or create a new course.</p>
            <Link
              to="/instructor/courses/new"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;