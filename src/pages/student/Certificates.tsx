import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Download, Calendar, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Certificates: React.FC = () => {
  const { t } = useTranslation();

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
      title: t('achievements.firstCourse.title'),
      description: t('achievements.firstCourse.description'),
      icon: '🎓',
      date: '2023-12-15',
      type: 'milestone'
    },
    {
      id: 2,
      title: t('achievements.streak.title'),
      description: t('achievements.streak.description'),
      icon: '🔥',
      date: '2024-01-15',
      type: 'streak'
    },
    {
      id: 3,
      title: t('achievements.master.title'),
      description: t('achievements.master.description'),
      icon: '📝',
      date: '2024-01-12',
      type: 'achievement'
    },
    {
      id: 4,
      title: t('achievements.enthusiast.title'),
      description: t('achievements.enthusiast.description'),
      icon: '⏰',
      date: '2024-01-20',
      type: 'hours'
    }
  ];

  const handleDownloadCertificate = (certificateId: string) => {
    // In real app, this would trigger a download
    console.log('Downloading certificate:', certificateId);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 rtl:text-right">
          <h1 className="text-3xl font-bold text-text dark:text-white mb-2">{t('certificates.title')}</h1>
          <p className="text-gray-600 dark:text-slate-400">{t('certificates.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-primary-600 mb-2">{certificates.length}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('certificates.earned')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-amber-500 mb-2">{achievements.length}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('certificates.achievements')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-blue-500 mb-2">
              {certificates.reduce((total, cert) => total + cert.hours, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('certificates.hours')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 text-center border border-neutral-100 dark:border-slate-800">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {certificates.filter(c => c.grade === 'A' || c.grade === 'A-').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('certificates.topGrades')}</div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text dark:text-white mb-6 rtl:text-right">{t('common.certificates')}</h2>

          {certificates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-500 border border-neutral-100 dark:border-slate-800 group hover:border-amber-600 transition-all">
                  <div className="flex items-start justify-between mb-4 rtl:flex-row-reverse">
                    <div className="flex items-center gap-4 rtl:flex-row-reverse">
                      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                        <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="rtl:text-right">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{certificate.courseTitle}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('courses.instructor')}: {certificate.instructor}</p>
                      </div>
                    </div>
                    <div className="text-right rtl:text-left">
                      <div className="text-3xl font-black text-amber-500">{certificate.grade}</div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('common.grade')}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm rtl:text-right">
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-neutral-600 dark:text-neutral-400">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span>{t('certificates.completed')}: {certificate.completionDate}</span>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-neutral-600 dark:text-neutral-400">
                      <BookOpen className="h-4 w-4 text-neutral-400" />
                      <span>{certificate.hours} {t('common.hours')}</span>
                    </div>
                  </div>

                  <div className="mb-6 rtl:text-right">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">{t('certificates.skillsLearned')}</p>
                    <div className="flex flex-wrap gap-2 rtl:flex-row-reverse">
                      {certificate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-lg border border-primary-100 dark:border-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rtl:flex-row-reverse pt-6 border-t border-neutral-50 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {t('certificates.id')}: {certificate.certificateId}
                    </div>
                    <button
                      onClick={() => handleDownloadCertificate(certificate.certificateId)}
                      className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all font-bold text-sm shadow-soft rtl:flex-row-reverse"
                    >
                      <Download className="h-4 w-4" />
                      <span>{t('common.download')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border-2 border-dashed border-neutral-100 dark:border-slate-800">
              <Award className="h-20 w-20 text-neutral-200 dark:text-slate-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{t('certificates.noData')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">{t('certificates.noDataSubtitle')}</p>
              <Link
                to="/courses"
                className="inline-flex items-center bg-primary-600 text-white px-8 py-3.5 rounded-2xl hover:bg-primary-700 transition-all font-bold shadow-glow"
              >
                {t('home.hero.browse')}
              </Link>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 rtl:text-right">{t('certificates.achievementsTitle')}</h2>

          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft p-8 text-center border border-neutral-100 dark:border-slate-800 hover:shadow-glow-sm transition-all group">
                  <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{achievement.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 line-clamp-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest rtl:flex-row-reverse pt-4 border-t border-neutral-50 dark:border-slate-800">
                    <Calendar className="h-3 w-3" />
                    <span>{achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-neutral-100 dark:border-slate-800">
              <Star className="h-20 w-20 text-neutral-200 dark:text-slate-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{t('common.noData')}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{t('certificates.achievementsSubtitle')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;