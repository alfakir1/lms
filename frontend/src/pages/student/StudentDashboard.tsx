import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, Clock, CreditCard, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { paymentService } from '../../services/paymentService';
import type { EnrollmentWithCourse } from '../../services/enrollmentService';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorMessage, LoadingSpinner, EmptyState } from '../../components/ui/Feedback';

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

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError, refetch: refetchEnrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  const { data: payments, isLoading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => paymentService.getAll({ per_page: 10 }),
  });

  const activeEnrollments = useMemo(
    () => (enrollments || []).filter((e) => e.status === 'active' && e.payment_status === 'paid'),
    [enrollments]
  );

  const completedCount = activeEnrollments.filter((e) => (e.progress_percent ?? 0) >= 100).length;
  const inProgressCount = activeEnrollments.filter((e) => {
    const p = e.progress_percent ?? 0;
    return p > 0 && p < 100;
  }).length;

  const pendingAccessCount = (enrollments || []).filter((e) => !(e.status === 'active' && e.payment_status === 'paid')).length;

  const paymentStats = useMemo(() => {
    const list = payments?.data || [];
    return {
      pending: list.filter((p) => p.status === 'pending').length,
      under_review: list.filter((p) => p.status === 'under_review').length,
      rejected: list.filter((p) => p.status === 'rejected').length,
    };
  }, [payments]);

  if (enrollmentsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner text={t('common.loading')} />
      </div>
    );
  }

  if (enrollmentsError || paymentsError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-md w-full">
          <ErrorMessage 
            title={t('common.noData') || 'Dashboard Error'} 
            message="We couldn't load your dashboard data." 
            onRetry={() => { refetchEnrollments(); refetchPayments(); }} 
          />
        </div>
      </div>
    );
  }

  const continueLearning = [...activeEnrollments]
    .sort((a, b) => (b.progress_percent ?? 0) - (a.progress_percent ?? 0))
    .slice(0, 3);

  const recentPayments = (payments?.data || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('student.welcome')} {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your progress and pick up where you left off.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            label={t('student.activeCourses')}
            value={activeEnrollments.length}
            cls="bg-primary-600"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6" />}
            label={t('student.completed')}
            value={completedCount}
            cls="bg-secondary-600"
          />
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            label={t('student.ongoingLearning')}
            value={inProgressCount}
            cls="bg-sky-500"
          />
          <StatCard
            icon={<CreditCard className="h-6 w-6" />}
            label={t('reception.pendingPayments')}
            value={paymentStats.pending + paymentStats.under_review}
            cls="bg-amber-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card className="dark:bg-slate-900 border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('student.continueLearning')}</h2>
                  <Link to="/student/courses" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    {t('common.viewAll')}
                  </Link>
                </div>

                {continueLearning.length === 0 ? (
                  <EmptyState 
                    title={t('student.noCoursesYet')} 
                    description={t('student.browseCourseCatalog')}
                    action={
                      <Link to="/courses">
                        <Button>{t('student.browseCourseCatalog')}</Button>
                      </Link>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {continueLearning.map((e: EnrollmentWithCourse) => {
                      const p = e.progress_percent ?? 0;
                      return (
                        <div key={e.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary-200 dark:hover:border-primary-800 transition">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 dark:text-white truncate">{e.course?.title}</h3>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-xs">
                                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${p}%` }} />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{p}% {t('common.completed')}</span>
                              </div>
                            </div>
                            <Link to={`/student/courses/${e.course_id}/learn`}>
                              <Button>{t('student.continue')}</Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="dark:bg-slate-900 border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.payments')}</h2>
                  <Link to="/student/payments" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    {t('common.viewAll')}
                  </Link>
                </div>

                {recentPayments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                    No payment requests yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentPayments.map((p) => (
                      <div key={p.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{p.course?.title || `Course #${p.course_id}`}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">#{p.id} • ${Number(p.amount).toFixed(2)}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          p.status === 'approved' ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400' :
                          p.status === 'rejected' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' :
                          'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {t(`common.${p.status}`) || p.status.replace('_', ' ')}
                        </span>
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
                <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('footer.quickLinks')}</h2>
                <div className="space-y-3">
                  <Link to="/courses">
                    <Button variant="outline" className="w-full justify-start ltr:text-left rtl:text-right">
                      <BookOpen className="h-4 w-4 ltr:mr-3 rtl:ml-3 text-slate-400" />
                      {t('student.browseCourseCatalog')}
                    </Button>
                  </Link>
                  <Link to="/student/payments">
                    <Button variant="outline" className="w-full justify-start ltr:text-left rtl:text-right">
                      <CreditCard className="h-4 w-4 ltr:mr-3 rtl:ml-3 text-slate-400" />
                      {t('admin.payments')}
                    </Button>
                  </Link>
                  <Link to="/student/attendance">
                    <Button variant="outline" className="w-full justify-start ltr:text-left rtl:text-right">
                      <QrCode className="h-4 w-4 ltr:mr-3 rtl:ml-3 text-secondary-500" />
                      {t('nav.attendance')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {pendingAccessCount > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-5 text-amber-900 dark:text-amber-400">
                <h3 className="font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5" /> {t('common.pending')}
                </h3>
                <p className="text-sm mt-2">
                  You have {pendingAccessCount} course(s) awaiting payment approval. Access will be granted automatically once approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
