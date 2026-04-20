import React, { useState } from 'react';
import { Download, Users, DollarSign, BookOpen, BarChart3, Activity } from 'lucide-react';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Mock report data
  const reports = {
    overview: {
      totalUsers: 2450,
      newUsers: 145,
      totalCourses: 89,
      totalRevenue: 45680,
      averageOrderValue: 127,
      completionRate: 78,
      topCourses: [
        { title: 'Web Development Fundamentals', enrollments: 234, revenue: 23166 },
        { title: 'React for Beginners', enrollments: 189, revenue: 14931 },
        { title: 'Python Programming', enrollments: 156, revenue: 13944 }
      ],
      userGrowth: [
        { month: 'Jan', users: 2100 },
        { month: 'Feb', users: 2180 },
        { month: 'Mar', users: 2250 },
        { month: 'Apr', users: 2320 },
        { month: 'May', users: 2380 },
        { month: 'Jun', users: 2450 }
      ],
      revenueGrowth: [
        { month: 'Jan', revenue: 28000 },
        { month: 'Feb', revenue: 32000 },
        { month: 'Mar', revenue: 38000 },
        { month: 'Apr', revenue: 41000 },
        { month: 'May', revenue: 44000 },
        { month: 'Jun', revenue: 45680 }
      ]
    },
    users: {
      totalStudents: 1890,
      totalInstructors: 23,
      totalAdmins: 3,
      activeUsers: 1456,
      inactiveUsers: 460,
      newRegistrations: 145,
      userDemographics: {
        students: 77,
        instructors: 1,
        admins: 0.1
      },
      topCountries: [
        { country: 'United States', users: 890 },
        { country: 'India', users: 456 },
        { country: 'United Kingdom', users: 234 },
        { country: 'Canada', users: 189 },
        { country: 'Australia', users: 123 }
      ]
    },
    courses: {
      totalCourses: 89,
      publishedCourses: 76,
      draftCourses: 13,
      totalEnrollments: 1847,
      averageRating: 4.6,
      completionRate: 78,
      topPerforming: [
        { title: 'Web Development Fundamentals', enrollments: 234, rating: 4.8, revenue: 23166 },
        { title: 'React for Beginners', enrollments: 189, rating: 4.7, revenue: 14931 },
        { title: 'Python Programming', enrollments: 156, rating: 4.6, revenue: 13944 },
        { title: 'Data Science with Python', enrollments: 134, rating: 4.9, revenue: 20066 },
        { title: 'UI/UX Design Principles', enrollments: 98, rating: 4.5, revenue: 11702 }
      ],
      categoryBreakdown: [
        { category: 'Programming', courses: 34, enrollments: 756 },
        { category: 'Data Science', courses: 18, enrollments: 423 },
        { category: 'Design', courses: 15, enrollments: 289 },
        { category: 'Business', courses: 12, enrollments: 234 },
        { category: 'Marketing', courses: 10, enrollments: 145 }
      ]
    },
    financial: {
      totalRevenue: 45680,
      monthlyRecurringRevenue: 12500,
      averageOrderValue: 127,
      refundRate: 2.3,
      paymentMethods: [
        { method: 'Credit Card', percentage: 65, amount: 29692 },
        { method: 'PayPal', percentage: 25, amount: 11420 },
        { method: 'Bank Transfer', percentage: 8, amount: 3654 },
        { method: 'Other', percentage: 2, amount: 914 }
      ],
      revenueByCategory: [
        { category: 'Programming', revenue: 25680 },
        { category: 'Data Science', revenue: 12800 },
        { category: 'Design', revenue: 5200 },
        { category: 'Business', revenue: 1500 },
        { category: 'Marketing', percentage: 500 }
      ]
    }
  };

  const handleExportReport = (type: string) => {
    console.log(`Exporting ${type} report for ${dateRange}`);
    // In real app, this would generate and download the report
  };

  const renderOverviewReport = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-primary">{reports.overview.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 text-sm text-green-600">
            +{reports.overview.newUsers} new this month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-accent">${reports.overview.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-accent" />
          </div>
          <div className="mt-4 text-sm text-green-600">
            +12% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-secondary">{reports.overview.totalCourses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-secondary" />
          </div>
          <div className="mt-4 text-sm text-green-600">
            +5 new this month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-text">{reports.overview.completionRate}%</p>
            </div>
            <Activity className="h-8 w-8 text-text" />
          </div>
          <div className="mt-4 text-sm text-green-600">
            +2% from last month
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {reports.overview.userGrowth.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${(data.users / 2500) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs font-semibold text-text">{data.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Revenue Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {reports.overview.revenueGrowth.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-accent rounded-t"
                  style={{ height: `${(data.revenue / 50000) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs font-semibold text-text">${data.revenue / 1000}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Top Performing Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text">Course</th>
                <th className="text-center py-3 px-4 font-semibold text-text">Enrollments</th>
                <th className="text-center py-3 px-4 font-semibold text-text">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reports.overview.topCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{course.title}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-text">{course.enrollments}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-accent">${course.revenue.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsersReport = () => (
    <div className="space-y-8">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{reports.users.totalStudents.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{reports.users.totalInstructors}</div>
          <div className="text-sm text-gray-600">Instructors</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{reports.users.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>

      {/* User Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">User Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text">Students</span>
              <span className="font-semibold text-primary">{reports.users.userDemographics.students}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${reports.users.userDemographics.students}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text">Instructors</span>
              <span className="font-semibold text-blue-600">{reports.users.userDemographics.instructors}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${reports.users.userDemographics.instructors}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Top Countries</h3>
          <div className="space-y-3">
            {reports.users.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-text">{country.country}</span>
                <span className="font-semibold text-primary">{country.users}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoursesReport = () => (
    <div className="space-y-8">
      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{reports.courses.totalCourses}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{reports.courses.publishedCourses}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-accent mb-2">{reports.courses.totalEnrollments.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Enrollments</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{reports.courses.averageRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Top Performing Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text">Course</th>
                <th className="text-center py-3 px-4 font-semibold text-text">Enrollments</th>
                <th className="text-center py-3 px-4 font-semibold text-text">Rating</th>
                <th className="text-center py-3 px-4 font-semibold text-text">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reports.courses.topPerforming.map((course, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{course.title}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-text">{course.enrollments}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-yellow-600">{course.rating} ★</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-accent">${course.revenue.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.courses.categoryBreakdown.map((category, index) => (
            <div key={index} className="text-center">
              <h4 className="font-semibold text-primary mb-2">{category.category}</h4>
              <div className="text-2xl font-bold text-text mb-1">{category.courses}</div>
              <div className="text-sm text-gray-600">courses</div>
              <div className="text-lg font-semibold text-accent">{category.enrollments}</div>
              <div className="text-sm text-gray-600">enrollments</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-accent mb-2">${reports.financial.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">${reports.financial.averageOrderValue}</div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">${reports.financial.monthlyRecurringRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">MRR</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{reports.financial.refundRate}%</div>
          <div className="text-sm text-gray-600">Refund Rate</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {reports.financial.paymentMethods.map((method, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text">{method.method}</span>
                  <span className="font-semibold text-primary">{method.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">${method.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {reports.financial.revenueByCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-text">{category.category}</span>
                <span className="font-semibold text-accent">${category.revenue?.toLocaleString() || category.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your LMS performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => handleExportReport(reportType)}
              className="flex items-center space-x-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'financial', label: 'Financial', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  reportType === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'overview' && renderOverviewReport()}
        {reportType === 'users' && renderUsersReport()}
        {reportType === 'courses' && renderCoursesReport()}
        {reportType === 'financial' && renderFinancialReport()}
      </div>
    </div>
  );
};

export default Reports;