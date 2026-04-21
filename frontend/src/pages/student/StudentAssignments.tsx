import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Upload, Eye } from 'lucide-react';

const StudentAssignments: React.FC = () => {
  const [filter, setFilter] = useState('all');

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Build a Responsive Landing Page',
      course: 'Web Development Fundamentals',
      description: 'Create a responsive landing page using HTML, CSS, and JavaScript. Include a hero section, features section, and contact form.',
      dueDate: '2024-01-20',
      status: 'submitted',
      submittedDate: '2024-01-18',
      grade: 'A',
      feedback: 'Excellent work! Your landing page demonstrates a good understanding of responsive design principles.',
      instructor: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'React Component Exercise',
      course: 'React for Beginners',
      description: 'Build a reusable React component that displays user information and handles form submission.',
      dueDate: '2024-01-25',
      status: 'pending',
      submittedDate: null,
      grade: null,
      feedback: null,
      instructor: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Database Design Project',
      course: 'Python Programming',
      description: 'Design and implement a database schema for a library management system using SQLite.',
      dueDate: '2024-01-15',
      status: 'overdue',
      submittedDate: null,
      grade: null,
      feedback: null,
      instructor: 'David Wilson'
    },
    {
      id: 4,
      title: 'Data Visualization Challenge',
      course: 'Data Science with Python',
      description: 'Create visualizations for a dataset using matplotlib and seaborn. Include at least 3 different chart types.',
      dueDate: '2024-02-01',
      status: 'not-submitted',
      submittedDate: null,
      grade: null,
      feedback: null,
      instructor: 'Lisa Rodriguez'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'not-submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'pending':
        return 'Pending Review';
      case 'overdue':
        return 'Overdue';
      case 'not-submitted':
        return 'Not Submitted';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">My Assignments</h1>
          <p className="text-gray-600">Track your assignment submissions and grades</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{assignments.length}</div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {assignments.filter(a => a.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {assignments.filter(a => a.status === 'overdue').length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
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
              <option value="all">All Assignments</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending Review</option>
              <option value="overdue">Overdue</option>
              <option value="not-submitted">Not Submitted</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-primary">{assignment.title}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      <span>{getStatusText(assignment.status)}</span>
                    </span>
                  </div>

                  <p className="text-text mb-2">
                    <span className="font-medium">Course:</span> {assignment.course}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <div>
                      <span>Instructor: {assignment.instructor}</span>
                    </div>
                    {assignment.submittedDate && (
                      <div>
                        <span>Submitted: {assignment.submittedDate}</span>
                      </div>
                    )}
                  </div>

                  {isOverdue(assignment.dueDate) && assignment.status !== 'submitted' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3">
                      This assignment is overdue. Please submit as soon as possible.
                    </div>
                  )}
                </div>

                <div className="text-right">
                  {assignment.grade && (
                    <div className="text-2xl font-bold text-accent mb-2">{assignment.grade}</div>
                  )}
                  {assignment.status === 'submitted' && !assignment.grade && (
                    <div className="text-sm text-yellow-600">Awaiting grade</div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-text mb-4">{assignment.description}</p>

                {assignment.feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Instructor Feedback</h4>
                    <p className="text-blue-800">{assignment.feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                    {assignment.status === 'submitted' ? (
                      <>
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center space-x-2 text-secondary hover:text-primary border border-secondary/20 px-3 py-2 rounded-lg"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Print as PDF</span>
                        </button>
                        <button className="flex items-center space-x-2 text-secondary hover:text-primary px-3 py-2">
                          <Eye className="h-4 w-4" />
                          <span>View Submission</span>
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Submit Assignment</span>
                      </button>
                    )}
                  </div>

                  <Link
                    to={`/student/courses/${assignment.id}/learn`}
                    className="text-secondary hover:text-primary text-sm"
                  >
                    Go to Course →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Assignments */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-text mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;