import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, CheckCircle, Play, User, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseDetails: React.FC = () => {
  const { t } = useTranslation();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data - in real app, this would come from API
  const course = {
    id: 1,
    title: t('courses.items.webDev.title', 'Web Development Fundamentals'),
    description: t('courses.items.webDev.description', 'Learn HTML, CSS, and JavaScript to build modern websites from scratch.'),
    longDescription: t('courseDetails.longDescription', `This comprehensive web development course is designed for beginners who want to learn how to build modern, responsive websites from the ground up. You'll start with the fundamentals of HTML and CSS, then move on to JavaScript programming, and finally learn how to combine these technologies to create interactive web applications.`),
    instructor: {
      name: 'Sarah Johnson',
      title: t('instructor.title', 'Senior Web Developer'),
      bio: t('instructor.bio', 'Sarah has over 8 years of experience in web development and has worked with companies like Google and Microsoft.'),
      avatar: '/api/placeholder/100/100',
      rating: 4.9,
      students: 15420,
      courses: 12
    },
    price: 99,
    originalPrice: 149,
    duration: t('courses.duration_val', { val: 8 }),
    students: 1234,
    rating: 4.8,
    level: 'Beginner',
    category: t('courses.categories.webDev', 'Web Development'),
    lastUpdated: '2024-01-15',
    language: t('language.en', 'English'),
    features: [
      t('courseDetails.features.lifetime', 'Lifetime access to course materials'),
      t('courseDetails.features.cert', 'Certificate of completion'),
      t('courseDetails.features.mobile', 'Mobile and desktop access'),
      t('courseDetails.features.moneyBack', '30-day money-back guarantee'),
      t('courseDetails.features.resources', 'Downloadable resources'),
      t('courseDetails.features.support', 'Community support')
    ],
    curriculum: [
      {
        title: t('courseDetails.curriculum.html.title', 'Introduction to HTML'),
        duration: '45 min',
        lessons: [
          { title: t('courseDetails.curriculum.html.lesson1', 'What is HTML?'), duration: '10 min' },
          { title: t('courseDetails.curriculum.html.lesson2', 'Setting up environment'), duration: '15 min' },
          { title: t('courseDetails.curriculum.html.lesson3', 'Basic HTML structure'), duration: '20 min' }
        ]
      },
      {
        title: t('courseDetails.curriculum.css.title', 'CSS Fundamentals'),
        duration: '1h 30min',
        lessons: [
          { title: t('courseDetails.curriculum.css.lesson1', 'Introduction to CSS'), duration: '20 min' },
          { title: t('courseDetails.curriculum.css.lesson2', 'Selectors and properties'), duration: '25 min' },
          { title: t('courseDetails.curriculum.css.lesson3', 'Box model and layout'), duration: '30 min' },
          { title: t('courseDetails.curriculum.css.lesson4', 'Responsive design basics'), duration: '15 min' }
        ]
      }
    ]
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Course Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-neutral-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8 rtl:flex-row-reverse">
            {/* Course Info */}
            <div className="lg:col-span-2 rtl:text-right">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary text-white rounded-full mb-2">
                  {course.category}
                </span>
                <span className={`inline-block mx-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {t(`courses.levels.${course.level.toLowerCase()}`, course.level)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-text dark:text-white mb-4">{course.title}</h1>

              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600 dark:text-slate-400 rtl:flex-row-reverse">
                <div className="flex items-center rtl:flex-row-reverse">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-text dark:text-white font-semibold ml-1 rtl:mr-1 rtl:ml-0">{course.rating}</span>
                  <span className="ml-1 rtl:mr-1 rtl:ml-0">({course.students} {t('courses.students')})</span>
                </div>
                <div className="flex items-center rtl:flex-row-reverse">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="ml-1 rtl:mr-1 rtl:ml-0">{course.duration}</span>
                </div>
                <div className="flex items-center rtl:flex-row-reverse">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="ml-1 rtl:mr-1 rtl:ml-0">{t('courses.instructor')}: {course.instructor.name}</span>
                </div>
                <div className="flex items-center rtl:flex-row-reverse">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="ml-1 rtl:mr-1 rtl:ml-0">{t('courseDetails.lastUpdated')}: {course.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-lg p-6 shadow-lg sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-accent mb-2">${course.price}</div>
                  {course.originalPrice > course.price && (
                    <div className="text-lg text-gray-500 line-through">${course.originalPrice}</div>
                  )}
                </div>

                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                  >
                    {t('courseDetails.enrollNow')}
                  </button>
                ) : (
                  <Link
                    to={`/student/courses/${course.id}/learn`}
                    className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-4 text-center block"
                  >
                    {t('courseDetails.startLearning')}
                  </Link>
                )}

                <div className="space-y-3">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center rtl:flex-row-reverse">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0" />
                      <span className="text-sm text-text dark:text-slate-300 rtl:text-right">{feature}</span>
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
        <div className="grid lg:grid-cols-3 gap-8 rtl:flex-row-reverse">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 rtl:text-right">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-text dark:text-white mb-4">{t('courseDetails.whatYouLearn')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-start rtl:flex-row-reverse">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 rtl:mr-0 rtl:ml-3 mt-0.5 shrink-0" />
                    <span className="text-text dark:text-slate-300">{t(`courseDetails.outcomes.${i}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-text dark:text-white mb-4">{t('courseDetails.courseContent')}</h2>
              <div className="space-y-4">
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rtl:flex-row-reverse">
                      <h3 className="font-semibold text-text dark:text-white">{section.title}</h3>
                      <span className="text-sm text-gray-600 dark:text-slate-400">{section.duration}</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rtl:flex-row-reverse">
                          <div className="flex items-center rtl:flex-row-reverse">
                            <Play className="h-4 w-4 text-gray-400 mr-3 rtl:mr-0 rtl:ml-3 rtl:rotate-180" />
                            <span className="text-text dark:text-slate-300">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-slate-400">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-text dark:text-white mb-4">{t('courseDetails.requirements')}</h2>
              <ul className="space-y-2">
                {[1, 2, 3].map(i => (
                  <li key={i} className="flex items-start text-text dark:text-slate-300 rtl:flex-row-reverse">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2">•</span>
                    <span>{t(`courseDetails.reqItems.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-text dark:text-white mb-4">{t('courseDetails.description')}</h2>
              <p className="text-text dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {course.longDescription}
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sticky top-6 border border-neutral-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-text dark:text-white mb-4 rtl:text-right">{t('courseDetails.courseFeatures')}</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between rtl:flex-row-reverse">
                  <span className="text-gray-500">{t('courses.duration')}</span>
                  <span className="font-semibold dark:text-white">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between rtl:flex-row-reverse">
                  <span className="text-gray-500">{t('courses.level_label', 'Level')}</span>
                  <span className="font-semibold dark:text-white">{t(`courses.levels.${course.level.toLowerCase()}`, course.level)}</span>
                </div>
                <div className="flex items-center justify-between rtl:flex-row-reverse">
                  <span className="text-gray-500">{t('language.label')}</span>
                  <span className="font-semibold dark:text-white">{course.language}</span>
                </div>
                <div className="flex items-center justify-between rtl:flex-row-reverse">
                  <span className="text-gray-500">{t('courses.students')}</span>
                  <span className="font-semibold dark:text-white">{course.students.toLocaleString()}</span>
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