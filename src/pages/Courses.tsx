import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: t('courses.items.webDev.title', 'Web Development Fundamentals'),
      description: t('courses.items.webDev.description', 'Learn HTML, CSS, and JavaScript to build modern websites from scratch.'),
      instructor: 'Sarah Johnson',
      price: 99,
      originalPrice: 149,
      duration: t('courses.duration_val', { val: 8 }),
      students: 1234,
      rating: 4.8,
      category: 'web-development',
      level: 'Beginner',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: t('courses.items.react.title', 'React for Beginners'),
      description: t('courses.items.react.description', 'Master React.js and build interactive user interfaces with modern hooks.'),
      instructor: 'Mike Chen',
      price: 149,
      originalPrice: 199,
      duration: t('courses.duration_val', { val: 12 }),
      students: 856,
      rating: 4.9,
      category: 'web-development',
      level: 'Intermediate',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: t('courses.items.python.title', 'Python Programming Complete Guide'),
      description: t('courses.items.python.description', 'Complete guide to Python programming from basics to advanced concepts.'),
      instructor: 'David Wilson',
      price: 129,
      originalPrice: 179,
      duration: t('courses.duration_val', { val: 15 }),
      students: 2156,
      rating: 4.7,
      category: 'programming',
      level: 'All Levels',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: t('courses.items.dataScience.title', 'Data Science with Python'),
      description: t('courses.items.dataScience.description', 'Learn data analysis, visualization, and machine learning with Python.'),
      instructor: 'Lisa Rodriguez',
      price: 199,
      originalPrice: 249,
      duration: t('courses.duration_val', { val: 20 }),
      students: 743,
      rating: 4.6,
      category: 'data-science',
      level: 'Advanced',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: t('courses.items.uiux.title', 'UI/UX Design Principles'),
      description: t('courses.items.uiux.description', 'Master the fundamentals of user interface and user experience design.'),
      instructor: 'Alex Thompson',
      price: 89,
      originalPrice: 129,
      duration: t('courses.duration_val', { val: 10 }),
      students: 967,
      rating: 4.5,
      category: 'design',
      level: 'Beginner',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: t('courses.items.marketing.title', 'Digital Marketing Mastery'),
      description: t('courses.items.marketing.description', 'Complete digital marketing course covering SEO, social media, and analytics.'),
      instructor: 'Emma Davis',
      price: 159,
      originalPrice: 199,
      duration: t('courses.duration_val', { val: 18 }),
      students: 1543,
      rating: 4.4,
      category: 'marketing',
      level: 'Intermediate',
      image: '/api/placeholder/300/200'
    }
  ];

  const categories = [
    { value: 'all', label: t('courses.allCategories', 'All Categories') },
    { value: 'web-development', label: t('courses.categories.webDev', 'Web Development') },
    { value: 'programming', label: t('courses.categories.programming', 'Programming') },
    { value: 'data-science', label: t('courses.categories.dataScience', 'Data Science') },
    { value: 'design', label: t('courses.categories.design', 'Design') },
    { value: 'marketing', label: t('courses.categories.marketing', 'Marketing') }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text dark:text-white mb-4">{t('courses.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 mb-8 border border-neutral-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 rtl:flex-row-reverse">
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('courses.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none rtl:text-right"
              />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none rtl:text-right"
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
          <p className="text-text dark:text-slate-400 rtl:text-right">
            {String(t('courses.showing', { count: filteredCourses.length, total: courses.length }))}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-neutral-100 dark:border-slate-800 flex flex-col rtl:text-right">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-sm opacity-90 uppercase tracking-widest">{course.category.replace('-', ' ')}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-3 rtl:text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {t(`courses.levels.${course.level.toLowerCase().replace(' ', '')}`, course.level)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-primary dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-text dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center mb-3 text-sm text-text dark:text-slate-400 mt-auto rtl:flex-row-reverse rtl:justify-end">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 rtl:mr-1 rtl:ml-0">{course.rating}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 rtl:mr-1 rtl:ml-0">{course.students.toLocaleString()} {t('courses.students')}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 rtl:mr-1 rtl:ml-0">{course.duration}</span>
                  </div>
                </div>

                <p className="text-sm text-text dark:text-slate-400 mb-4">
                  {t('courses.instructor')}: <span className="font-medium text-primary dark:text-secondary">{course.instructor}</span>
                </p>

                <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-2xl font-bold text-accent">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                    )}
                  </div>
                  {course.originalPrice > course.price && (
                    <span className="text-sm bg-accent text-white px-2 py-1 rounded">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% {t('common.off', 'OFF')}
                    </span>
                  )}
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-bold"
                >
                  {t('courses.viewDetails')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text dark:text-white mb-2">{t('common.noData')}</h3>
            <p className="text-gray-600 dark:text-slate-400">{t('courses.noResults', 'Try adjusting your search or filter criteria.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;