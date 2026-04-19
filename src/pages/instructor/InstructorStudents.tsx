import React, { useState } from 'react';
import { Users, Mail, Phone, Calendar, Search, Filter } from 'lucide-react';

const InstructorStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock students data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      enrolledDate: '2024-01-01',
      coursesEnrolled: 3,
      completedCourses: 2,
      averageGrade: 'A-',
      lastActivity: '2024-01-18',
      status: 'active',
      courses: [
        { id: 1, title: 'Web Development Fundamentals', progress: 75, grade: 'A' },
        { id: 2, title: 'React for Beginners', progress: 45, grade: null },
        { id: 3, title: 'Python Programming', progress: 100, grade: 'A-' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      enrolledDate: '2024-01-05',
      coursesEnrolled: 2,
      completedCourses: 1,
      averageGrade: 'B+',
      lastActivity: '2024-01-17',
      status: 'active',
      courses: [
        { id: 2, title: 'React for Beginners', progress: 80, grade: 'B+' },
        { id: 4, title: 'Data Science with Python', progress: 30, grade: null }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      enrolledDate: '2023-12-15',
      coursesEnrolled: 4,
      completedCourses: 3,
      averageGrade: 'A',
      lastActivity: '2024-01-10',
      status: 'inactive',
      courses: [
        { id: 1, title: 'Web Development Fundamentals', progress: 100, grade: 'A' },
        { id: 3, title: 'Python Programming', progress: 100, grade: 'A' },
        { id: 4, title: 'Data Science with Python', progress: 100, grade: 'A' },
        { id: 5, title: 'UI/UX Design Principles', progress: 60, grade: null }
      ]
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('C')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">My Students</h1>
          <p className="text-gray-600">Manage and track your students' progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {students.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {students.reduce((sum, s) => sum + s.coursesEnrolled, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {Math.round(students.reduce((sum, s) => sum + s.completedCourses, 0) / students.length * 100) / 100}
            </div>
            <div className="text-sm text-gray-600">Avg. Completion Rate</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search students by name or email..."
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
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-primary">{student.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Enrolled: {student.enrolledDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-text">{student.coursesEnrolled}</div>
                      <div className="text-gray-600">Courses</div>
                    </div>
                    <div>
                      <div className="font-semibold text-text">{student.completedCourses}</div>
                      <div className="text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className={`font-semibold px-2 py-1 rounded-full text-xs text-center ${getGradeColor(student.averageGrade)}`}>
                        {student.averageGrade || 'N/A'}
                      </div>
                      <div className="text-gray-600 text-xs">Avg Grade</div>
                    </div>
                    <div>
                      <div className="font-semibold text-text">{student.lastActivity}</div>
                      <div className="text-gray-600 text-xs">Last Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-text mb-4">Enrolled Courses</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.courses.map((course) => (
                    <div key={course.id} className="bg-background rounded-lg p-4">
                      <h5 className="font-medium text-primary mb-2 line-clamp-2">{course.title}</h5>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      {course.grade && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Grade</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(course.grade)}`}>
                            {course.grade}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <div className="flex space-x-3">
                  <button className="text-secondary hover:text-primary text-sm">
                    View Profile
                  </button>
                  <button className="text-secondary hover:text-primary text-sm">
                    Send Message
                  </button>
                  <button className="text-secondary hover:text-primary text-sm">
                    View Progress
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Last activity: {student.lastActivity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Students */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorStudents;