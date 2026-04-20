import React, { useState } from 'react';
import { FileText, User, MessageCircle, Download } from 'lucide-react';

const InstructorAssignments: React.FC = () => {
  const [filter, setFilter] = useState('all');

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Build a Responsive Landing Page',
      course: 'Web Development Fundamentals',
      student: 'John Doe',
      studentEmail: 'john@example.com',
      submittedDate: '2024-01-18',
      dueDate: '2024-01-20',
      status: 'pending',
      grade: null,
      feedback: '',
      submissionContent: 'Submitted a complete landing page with HTML, CSS, and JavaScript. Includes responsive design and modern UI elements.',
      attachments: ['landing-page.zip', 'screenshots.pdf']
    },
    {
      id: 2,
      title: 'React Component Exercise',
      course: 'React for Beginners',
      student: 'Jane Smith',
      studentEmail: 'jane@example.com',
      submittedDate: '2024-01-17',
      dueDate: '2024-01-25',
      status: 'graded',
      grade: 'A-',
      feedback: 'Excellent work! Your component demonstrates good understanding of React hooks and state management. Minor improvements needed in error handling.',
      submissionContent: 'Created a reusable form component with validation and state management.',
      attachments: ['react-component.js', 'readme.md']
    },
    {
      id: 3,
      title: 'Database Design Project',
      course: 'Python Programming',
      student: 'Mike Johnson',
      studentEmail: 'mike@example.com',
      submittedDate: '2024-01-16',
      dueDate: '2024-01-15',
      status: 'overdue',
      grade: null,
      feedback: '',
      submissionContent: 'Late submission - Database schema design for library management system.',
      attachments: ['schema.sql', 'erd-diagram.png']
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string, submittedDate: string) => {
    return new Date(submittedDate) > new Date(dueDate);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Grade Assignments</h1>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{assignments.length}</div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {assignments.filter(a => a.status === 'graded').length}
            </div>
            <div className="text-sm text-gray-600">Graded</div>
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
              <option value="pending">Pending Review</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
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
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    {isOverdue(assignment.dueDate, assignment.submittedDate) && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Late Submission
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-text mb-1">
                        <span className="font-medium">Course:</span> {assignment.course}
                      </p>
                      <p className="text-text mb-1">
                        <span className="font-medium">Student:</span> {assignment.student}
                      </p>
                      <p className="text-sm text-gray-600">{assignment.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Submitted:</span> {assignment.submittedDate}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Due:</span> {assignment.dueDate}
                      </p>
                      {assignment.grade && (
                        <p className="text-sm text-green-600">
                          <span className="font-medium">Grade:</span> {assignment.grade}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-text mb-2">Submission</h4>
                <p className="text-text mb-3">{assignment.submissionContent}</p>

                {assignment.attachments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-text mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignment.attachments.map((file, index) => (
                        <button
                          key={index}
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{file}</span>
                          <Download className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {assignment.feedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Your Feedback</h4>
                  <p className="text-blue-800">{assignment.feedback}</p>
                </div>
              )}

              {/* Grading Form */}
              {assignment.status === 'pending' && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-text mb-4">Grade Assignment</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">Grade</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Select grade</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-text mb-2">Quick Actions</label>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Approve
                        </button>
                        <button className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                          Needs Revision
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text mb-2">Feedback</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Provide detailed feedback for the student..."
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Submit Grade
                    </button>
                    <button className="border border-gray-300 text-text px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Save Draft
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 text-secondary hover:text-primary text-sm">
                    <MessageCircle className="h-4 w-4" />
                    <span>Message Student</span>
                  </button>
                  <button className="flex items-center space-x-2 text-secondary hover:text-primary text-sm">
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                </div>

                {assignment.status === 'graded' && (
                  <button className="text-secondary hover:text-primary text-sm">
                    Edit Grade
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Assignments */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorAssignments;