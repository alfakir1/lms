import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, CheckCircle, Play, BookOpen, User, Calendar } from 'lucide-react';

const CourseDetails: React.FC = () => {
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data - in real app, this would come from API
  const course = {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript to build modern websites from scratch. This comprehensive course covers everything you need to know to start your journey as a web developer.',
    longDescription: `This comprehensive web development course is designed for beginners who want to learn how to build modern, responsive websites from the ground up. You'll start with the fundamentals of HTML and CSS, then move on to JavaScript programming, and finally learn how to combine these technologies to create interactive web applications.

Throughout the course, you'll work on real-world projects that will help you build a strong portfolio. By the end of this course, you'll be able to create professional-looking websites and have the skills needed to pursue a career in web development.`,
    instructor: {
      name: 'Sarah Johnson',
      title: 'Senior Web Developer',
      bio: 'Sarah has over 8 years of experience in web development and has worked with companies like Google and Microsoft.',
      avatar: '/api/placeholder/100/100',
      rating: 4.9,
      students: 15420,
      courses: 12
    },
    price: 99,
    originalPrice: 149,
    duration: '8 hours',
    students: 1234,
    rating: 4.8,
    level: 'Beginner',
    category: 'Web Development',
    lastUpdated: '2024-01-15',
    language: 'English',
    features: [
      'Lifetime access to course materials',
      'Certificate of completion',
      'Mobile and desktop access',
      '30-day money-back guarantee',
      'Downloadable resources',
      'Community support'
    ],
    curriculum: [
      {
        title: 'Introduction to HTML',
        duration: '45 min',
        lessons: [
          { title: 'What is HTML?', duration: '10 min' },
          { title: 'Setting up your development environment', duration: '15 min' },
          { title: 'Basic HTML structure', duration: '20 min' }
        ]
      },
      {
        title: 'CSS Fundamentals',
        duration: '1h 30min',
        lessons: [
          { title: 'Introduction to CSS', duration: '20 min' },
          { title: 'Selectors and properties', duration: '25 min' },
          { title: 'Box model and layout', duration: '30 min' },
          { title: 'Responsive design basics', duration: '15 min' }
        ]
      },
      {
        title: 'JavaScript Basics',
        duration: '2h 15min',
        lessons: [
          { title: 'What is JavaScript?', duration: '15 min' },
          { title: 'Variables and data types', duration: '20 min' },
          { title: 'Functions and scope', duration: '30 min' },
          { title: 'DOM manipulation', duration: '35 min' },
          { title: 'Events and interactivity', duration: '35 min' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: 'John Doe',
        rating: 5,
        comment: 'Excellent course! Very comprehensive and easy to follow.',
        date: '2024-01-10'
      },
      {
        id: 2,
        user: 'Jane Smith',
        rating: 4,
        comment: 'Great content, but could use more practical examples.',
        date: '2024-01-08'
      }
    ]
  };

  const handleEnroll = () => {
    // In real app, this would make an API call
    setIsEnrolled(true);
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
                  {course.category}
                </span>
                <span className={`inline-block ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-text mb-4">{course.title}</h1>

              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-text font-semibold ml-1">{course.rating}</span>
                  <span className="text-gray-600 ml-1">({course.students} students)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">Created by {course.instructor.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600 ml-1">Last updated {course.lastUpdated}</span>
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

                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                  >
                    Enroll Now
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
                  {course.features.map((feature, index) => (
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
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                      <h3 className="font-semibold text-text">{section.title}</h3>
                      <span className="text-sm text-gray-600">{section.duration}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <Play className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-text">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-600">{lesson.duration}</span>
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
                  <span className="text-text">• Basic computer skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-text">• No prior programming experience required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-text">• A computer with internet access</span>
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-text whitespace-pre-line">{course.longDescription}</p>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-text mb-4">Your Instructor</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text">{course.instructor.name}</h3>
                  <p className="text-gray-600 mb-2">{course.instructor.title}</p>
                  <p className="text-text mb-4">{course.instructor.bio}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{course.instructor.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.instructor.students.toLocaleString()} Students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.instructor.courses} Courses</span>
                    </div>
                  </div>
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