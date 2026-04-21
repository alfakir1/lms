import React from 'react';
import { Award, Download, Calendar, BookOpen, Star } from 'lucide-react';

const Certificates: React.FC = () => {
  // Mock certificates data
  const certificates = [
    {
      id: 1,
      courseTitle: 'Python Programming Complete Guide',
      instructor: 'David Wilson',
      completionDate: '2024-01-10',
      grade: 'A',
      certificateId: 'CERT-2024-001',
      courseId: 3,
      skills: ['Python', 'Programming', 'Data Structures', 'Algorithms'],
      hours: 15
    },
    {
      id: 2,
      courseTitle: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      completionDate: '2023-12-15',
      grade: 'A-',
      certificateId: 'CERT-2023-045',
      courseId: 1,
      skills: ['HTML', 'CSS', 'JavaScript', 'Web Development'],
      hours: 8
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Completed your first course on Four Academy',
      icon: '🎓',
      date: '2023-12-15',
      type: 'milestone'
    },
    {
      id: 2,
      title: 'Week Streak',
      description: 'Studied for 7 consecutive days',
      icon: '🔥',
      date: '2024-01-15',
      type: 'streak'
    },
    {
      id: 3,
      title: 'Assignment Master',
      description: 'Submitted 10 assignments with high grades',
      icon: '📝',
      date: '2024-01-12',
      type: 'achievement'
    },
    {
      id: 4,
      title: 'Learning Enthusiast',
      description: 'Completed 50 hours of learning',
      icon: '⏰',
      date: '2024-01-20',
      type: 'hours'
    }
  ];

  const handleDownloadCertificate = (cert: any) => {
    // In a real app, this might download a PDF
    // For now, we'll open a print window for the certificate details
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${cert.courseTitle}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; border: 20px solid #0f172a; }
              .logo { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 40px; }
              .title { font-size: 48px; color: #0f172a; margin-bottom: 20px; }
              .name { font-size: 32px; font-weight: bold; margin-bottom: 40px; text-decoration: underline; }
              .details { font-size: 20px; color: #64748b; line-height: 1.6; }
              .id { margin-top: 50px; font-size: 14px; color: #94a3b8; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="logo">FOUR ACADEMY</div>
            <p>This is to certify that</p>
            <h2 class="name">Student Name</h2>
            <p>has successfully completed the course</p>
            <h1 class="title">${cert.courseTitle}</h1>
            <div class="details">
              <p>Conducted by: ${cert.instructor}</p>
              <p>Date of Completion: ${cert.completionDate}</p>
              <p>Grade Obtained: ${cert.grade}</p>
              <p>Total Duration: ${cert.hours} Hours</p>
            </div>
            <p class="id">Certificate ID: ${cert.certificateId}</p>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">My Certificates & Achievements</h1>
          <p className="text-gray-600">Showcase your learning accomplishments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{certificates.length}</div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">{achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {certificates.reduce((total, cert) => total + cert.hours, 0)}
            </div>
            <div className="text-sm text-gray-600">Learning Hours</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {certificates.filter(c => c.grade === 'A').length}
            </div>
            <div className="text-sm text-gray-600">A Grades</div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Certificates</h2>

          {certificates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-accent">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-accent rounded-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{certificate.courseTitle}</h3>
                        <p className="text-sm text-gray-600">by {certificate.instructor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{certificate.grade}</div>
                      <div className="text-xs text-gray-500">Grade</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Completed: {certificate.completionDate}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{certificate.hours} hours</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Skills Learned:</p>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Certificate ID: {certificate.certificateId}
                    </div>
                    <button
                      onClick={() => handleDownloadCertificate(certificate)}
                      className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download & Print</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No certificates yet</h3>
              <p className="text-gray-600 mb-4">Complete courses to earn certificates</p>
              <a
                href="/courses"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
              >
                Browse Courses
              </a>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-2xl font-bold text-text mb-6">Achievements</h2>

          {achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No achievements yet</h3>
              <p className="text-gray-600">Keep learning to unlock achievements</p>
            </div>
          )}
        </div>

        {/* Certificate Preview Modal Placeholder */}
        {/* In a real app, this would be a modal to preview certificates */}
      </div>
    </div>
  );
};

export default Certificates;