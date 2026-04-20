import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript to build modern websites from scratch.',
      instructor: 'Sarah Johnson',
      price: 99,
      originalPrice: 149,
      duration: '8 hours',
      students: 1234,
      rating: 4.8,
      category: 'web-development',
      level: 'Beginner',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'React for Beginners',
      description: 'Master React.js and build interactive user interfaces with modern hooks.',
      instructor: 'Mike Chen',
      price: 149,
      originalPrice: 199,
      duration: '12 hours',
      students: 856,
      rating: 4.9,
      category: 'web-development',
      level: 'Intermediate',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Python Programming Complete Guide',
      description: 'Complete guide to Python programming from basics to advanced concepts.',
      instructor: 'David Wilson',
      price: 129,
      originalPrice: 179,
      duration: '15 hours',
      students: 2156,
      rating: 4.7,
      category: 'programming',
      level: 'All Levels',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning with Python.',
      instructor: 'Lisa Rodriguez',
      price: 199,
      originalPrice: 249,
      duration: '20 hours',
      students: 743,
      rating: 4.6,
      category: 'data-science',
      level: 'Advanced',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'UI/UX Design Principles',
      description: 'Master the fundamentals of user interface and user experience design.',
      instructor: 'Alex Thompson',
      price: 89,
      originalPrice: 129,
      duration: '10 hours',
      students: 967,
      rating: 4.5,
      category: 'design',
      level: 'Beginner',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'Digital Marketing Mastery',
      description: 'Complete digital marketing course covering SEO, social media, and analytics.',
      instructor: 'Emma Davis',
      price: 159,
      originalPrice: 199,
      duration: '18 hours',
      students: 1543,
      rating: 4.4,
      category: 'marketing',
      level: 'Intermediate',
      image: '/api/placeholder/300/200'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'programming', label: 'Programming' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text mb-4">Our Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover professional courses taught by expert instructors. Start your learning journey today.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-text">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-sm opacity-90">{course.category.replace('-', ' ').toUpperCase()}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-text text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-text ml-1">{course.rating}</span>
                  </div>
                  <span className="text-text mx-2">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-text ml-1">{course.students.toLocaleString()}</span>
                  </div>
                  <span className="text-text mx-2">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-text ml-1">{course.duration}</span>
                  </div>
                </div>

                <p className="text-sm text-text mb-4">
                  Instructor: <span className="font-medium">{course.instructor}</span>
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-accent">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                    )}
                  </div>
                  {course.originalPrice > course.price && (
                    <span className="text-sm bg-accent text-white px-2 py-1 rounded">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;