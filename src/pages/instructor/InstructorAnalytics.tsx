import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, BookOpen, DollarSign, Activity } from 'lucide-react';

const InstructorAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analytics = {
    overview: {
      totalStudents: 245,
      totalCourses: 8,
      totalRevenue: 12500,
      averageRating: 4.8
    },
    coursePerformance: [
      {
        id: 1,
        title: 'Web Development Fundamentals',
        students: 89,
        completionRate: 78,
        averageGrade: 'A-',
        revenue: 4500,
        rating: 4.9
      },
      {
        id: 2,
        title: 'React for Beginners',
        students: 67,
        completionRate: 85,
        averageGrade: 'A',
        revenue: 3200,
        rating: 4.7
      },
      {
        id: 3,
        title: 'Python Programming',
        students: 45,
        completionRate: 72,
        averageGrade: 'B+',
        revenue: 2800,
        rating: 4.6
      },
      {
        id: 4,
        title: 'Data Science with Python',
        students: 34,
        completionRate: 65,
        averageGrade: 'B',
        revenue: 2000,
        rating: 4.5
      }
    ],
    enrollmentTrends: [
      { month: 'Jan', enrollments: 45 },
      { month: 'Feb', enrollments: 52 },
      { month: 'Mar', enrollments: 48 },
      { month: 'Apr', enrollments: 61 },
      { month: 'May', enrollments: 55 },
      { month: 'Jun', enrollments: 67 }
    ],
    revenueTrends: [
      { month: 'Jan', revenue: 1800 },
      { month: 'Feb', revenue: 2100 },
      { month: 'Mar', revenue: 1950 },
      { month: 'Apr', revenue: 2450 },
      { month: 'May', revenue: 2200 },
      { month: 'Jun', revenue: 2800 }
    ]
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-yellow-600';
    if (grade.startsWith('C')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-3xl font-bold text-text dark:text-white mb-2">{t('instructor.analyticsTitle', 'Analytics Dashboard')}</h1>
            <p className="text-gray-600 dark:text-slate-400">{t('instructor.analyticsSubtitle', 'Track your teaching performance and course metrics')}</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none rtl:text-right"
          >
            <option value="7d">{t('common.last7Days', 'Last 7 days')}</option>
            <option value="30d">{t('common.last30Days', 'Last 30 days')}</option>
            <option value="90d">{t('common.last90Days', 'Last 90 days')}</option>
            <option value="1y">{t('common.lastYear', 'Last year')}</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="rtl:text-right">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-400 mb-1">{t('instructor.totalStudents')}</p>
                <p className="text-2xl font-black text-primary">{analytics.overview.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm rtl:flex-row-reverse">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1 rtl:mr-0 rtl:ml-1" />
              <span className="text-green-600 font-bold">+12%</span>
              <span className="text-gray-600 dark:text-slate-500 ml-1 rtl:ml-0 rtl:mr-1">{t('instructor.fromLastMonth', 'from last month')}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="rtl:text-right">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-400 mb-1">{t('instructor.totalCourses')}</p>
                <p className="text-2xl font-black text-secondary">{analytics.overview.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="mt-4 flex items-center text-sm rtl:flex-row-reverse">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1 rtl:mr-0 rtl:ml-1" />
              <span className="text-green-600 font-bold">+2</span>
              <span className="text-gray-600 dark:text-slate-500 ml-1 rtl:ml-0 rtl:mr-1">{t('instructor.newThisMonth', 'new this month')}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="rtl:text-right">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-400 mb-1">{t('common.revenue')}</p>
                <p className="text-2xl font-black text-accent">{t('common.currency', { val: analytics.overview.totalRevenue })}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
            <div className="mt-4 flex items-center text-sm rtl:flex-row-reverse">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1 rtl:mr-0 rtl:ml-1" />
              <span className="text-green-600 font-bold">+18%</span>
              <span className="text-gray-600 dark:text-slate-500 ml-1 rtl:ml-0 rtl:mr-1">{t('instructor.fromLastMonth')}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="rtl:text-right">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-400 mb-1">{t('instructor.averageRating')}</p>
                <p className="text-2xl font-black text-text dark:text-white">{analytics.overview.averageRating}</p>
              </div>
              <Activity className="h-8 w-8 text-text dark:text-white" />
            </div>
            <div className="mt-4 flex items-center text-sm rtl:flex-row-reverse">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1 rtl:mr-0 rtl:ml-1" />
              <span className="text-green-600 font-bold">+0.2</span>
              <span className="text-gray-600 dark:text-slate-500 ml-1 rtl:ml-0 rtl:mr-1">{t('instructor.fromLastMonth')}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enrollment Trends */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-text dark:text-white mb-6 rtl:text-right">{t('instructor.enrollmentTrends', 'Enrollment Trends')}</h3>
            <div className="h-64 flex items-end justify-between space-x-2 rtl:space-x-reverse">
              {analytics.enrollmentTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all duration-500"
                    style={{ height: `${(data.enrollments / 70) * 100}%` }}
                  ></div>
                  <span className="text-xs font-bold text-gray-500 dark:text-slate-500 mt-2">{t(`common.months.${data.month.toLowerCase()}`, data.month)}</span>
                  <span className="text-xs font-black text-text dark:text-white">{data.enrollments}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-text dark:text-white mb-6 rtl:text-right">{t('instructor.revenueTrends', 'Revenue Trends')}</h3>
            <div className="h-64 flex items-end justify-between space-x-2 rtl:space-x-reverse">
              {analytics.revenueTrends.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent rounded-t-lg transition-all duration-500"
                    style={{ height: `${(data.revenue / 3000) * 100}%` }}
                  ></div>
                  <span className="text-xs font-bold text-gray-500 dark:text-slate-500 mt-2">{t(`common.months.${data.month.toLowerCase()}`, data.month)}</span>
                  <span className="text-xs font-black text-text dark:text-white">{t('common.currency', { val: data.revenue })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 border border-neutral-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-text dark:text-white mb-6 rtl:text-right">{t('instructor.coursePerformance', 'Course Performance')}</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="text-left rtl:text-right py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('common.course')}</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('instructor.totalStudents')}</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('instructor.completion', 'Completion')}</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('instructor.avgGrade', 'Avg Grade')}</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('common.revenue')}</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('common.rating')}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.coursePerformance.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-5 px-4 rtl:text-right">
                      <p className="font-bold text-primary dark:text-secondary">{course.title}</p>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="font-black text-text dark:text-white">{course.students}</span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center justify-center rtl:flex-row-reverse">
                        <div className="w-16 bg-gray-100 dark:bg-slate-800 rounded-full h-2 mr-2 rtl:mr-0 rtl:ml-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold dark:text-slate-300">{course.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className={`font-black ${getGradeColor(course.averageGrade)}`}>
                        {course.averageGrade}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="font-black text-accent">{t('common.currency', { val: course.revenue })}</span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 rtl:flex-row-reverse">
                        <span className="font-black text-text dark:text-white">{course.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <h4 className="font-bold text-text dark:text-white mb-3">{t('instructor.topPerforming', 'Top Performing Course')}</h4>
            <p className="text-primary dark:text-secondary font-black mb-2">React for Beginners</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{t('instructor.highestCompletion', 'Highest completion rate at 85%')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <h4 className="font-bold text-text dark:text-white mb-3">{t('instructor.mostPopular', 'Most Popular Course')}</h4>
            <p className="text-primary dark:text-secondary font-black mb-2">Web Development Fundamentals</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{t('instructor.studentsEnrolled', '89 students enrolled')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-neutral-100 dark:border-slate-800 rtl:text-right">
            <h4 className="font-bold text-text dark:text-white mb-3">{t('instructor.revenueLeader', 'Revenue Leader')}</h4>
            <p className="text-primary dark:text-secondary font-black mb-2">Web Development Fundamentals</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{t('common.currency', { val: 4500 })} {t('instructor.generated', 'generated')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;