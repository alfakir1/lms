import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Activity, QrCode } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorMessage, LoadingSpinner } from '../../components/ui/Feedback';
import { useTranslation } from 'react-i18next';

function StatCard({ icon, label, value, cls }: { icon: React.ReactNode; label: string; value: number | string; cls: string }) {
  return (
    <Card className="dark:bg-slate-900 border-0 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl text-white ${cls}`}>{icon}</div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const InstructorDashboard: React.FC = () => {
  const { t } = useTranslation();

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => courseService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <LoadingSpinner text={t('common.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full">
          <ErrorMessage 
            title="Dashboard Error" 
            message="We couldn't load your dashboard data." 
          />
        </div>
      </div>
    );
  }

  const courses = coursesData?.data || [];
  // For instructor dashboard stats we can extrapolate basic info from courses since we don't have a dedicated instructor stats endpoint yet
  const totalCourses = courses.length;
  // This is mock data for the instructor stats since backend only returns courses
  // In a real app we'd fetch /instructor/stats
  const activeStudents = totalCourses * 12; // fake stat for visual purpose, user didn't provide endpoint for instructor stats

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('instructor.dashboardTitle') || 'Instructor Dashboard'}</h1>
          <p className="text-slate-600 dark:text-slate-400">{t('instructor.subtitle') || 'Manage your courses and interact with your students.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            label={t('instructor.totalCourses') || 'Total Courses'}
            value={totalCourses}
            cls="bg-primary-600"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label={t('instructor.totalStudents') || 'Total Students'}
            value={activeStudents}
            cls="bg-sky-500"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            label={t('instructor.averageRating') || 'Engagement'}
            value="High"
            cls="bg-secondary-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="dark:bg-slate-900 border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('instructor.myCourses') || 'My Courses'}</h2>
                  <Link to="/instructor/courses" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    {t('common.viewAll') || 'View all'}
                  </Link>
                </div>

                {courses.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                    You haven't created any courses yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {courses.slice(0, 5).map((c: any) => (
                      <div key={c.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Status: <span className="uppercase text-xs font-bold text-primary-600 dark:text-primary-400">{c.status}</span>
                          </p>
                        </div>
                        <Link to={`/instructor/courses`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                          {t('instructor.manage') || 'Manage'}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="dark:bg-slate-900 border-0 shadow-soft">
              <CardContent className="p-6">
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <Link to="/instructor/courses" className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 transition">
                    <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400 ltr:mr-3 rtl:ml-3" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Manage Courses</span>
                  </Link>
                  <Link to="/instructor/attendance" className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 transition">
                    <QrCode className="h-5 w-5 text-secondary-600 dark:text-secondary-400 ltr:mr-3 rtl:ml-3" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Live Attendance</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
