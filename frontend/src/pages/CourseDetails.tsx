import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  CreditCard,
  Lock,
  Play,
  Upload,
  User,
  X,
  FileText
} from 'lucide-react';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { paymentService, type PaymentStatus } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ErrorMessage, LoadingSpinner } from '../components/ui/Feedback';
import type { Lecture } from '../types';
import { useTranslation } from 'react-i18next';

const PaymentStatusPanel = ({ status }: { status: PaymentStatus }) => {
  const { t } = useTranslation();
  const statusMap: Record<PaymentStatus, { title: string; body: string; className: string }> = {
    pending: {
      title: 'Waiting for Review',
      body: 'Your payment proof has been submitted and is currently waiting for admin review.',
      className: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    under_review: {
      title: 'Under Review',
      body: 'Our team is currently reviewing your payment proof. This should not take long.',
      className: 'bg-primary-50 text-primary-900 border-primary-200',
    },
    approved: {
      title: 'Access Granted',
      body: 'Your payment has been approved! You now have full access to this course.',
      className: 'bg-secondary-50 text-secondary-900 border-secondary-200',
    },
    rejected: {
      title: 'Try Again',
      body: 'Your previous payment proof could not be verified. Please upload a new document.',
      className: 'bg-rose-50 text-rose-900 border-rose-200',
    },
  };

  const item = statusMap[status];

  return (
    <div className={`rounded-xl border p-5 ${item.className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <CreditCard className="h-5 w-5" />
          {t('payment.status', 'Payment Status')}
        </div>
        <span className="bg-white/60 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide text-slate-900">
          {item.title}
        </span>
      </div>
      <p className="text-sm mt-2 leading-relaxed text-slate-900">{item.body}</p>
    </div>
  );
};

const CourseDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const { data: course, isLoading, error, refetch } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getById(id!),
    enabled: Boolean(id),
  });

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled: isAuthenticated,
    refetchInterval: (query) => {
      const active = query.state.data?.some((item) => String(item.course_id) === String(id) && item.status === 'active');
      return active ? false : 3000;
    },
  });

  const { data: latestPayment } = useQuery({
    queryKey: ['course-payment', id],
    queryFn: () => paymentService.getLatestForCourse(id!),
    enabled: isAuthenticated && Boolean(id),
    refetchInterval: (query) => {
      const payment = query.state.data;
      if (!payment) return false;
      return payment.status === 'pending' || payment.status === 'under_review' ? 5000 : false;
    },
  });

  const isEnrolled = Boolean(
    enrollments?.find((item) => String(item.course_id) === String(id) && item.status === 'active' && item.payment_status === 'paid')
  );

  const paymentMutation = useMutation({
    mutationFn: (payload: { courseId: number; file: File }) =>
      paymentService.create({ course_id: payload.courseId, proof_file: payload.file }),
    onSuccess: () => {
      showSuccess('Payment submitted successfully.');
      setShowPaymentModal(false);
      setProofFile(null);
      queryClient.invalidateQueries({ queryKey: ['course-payment', id] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    },
    onError: () => {
      showError('Failed to submit payment. Please try again later.');
    },
  });

  const handleOpenLecture = (lectureId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    if (!isEnrolled) {
      showError('Please enroll in the course to access this lecture.');
      return;
    }
    navigate(`/student/courses/${id}/learn?lecture=${lectureId}`);
  };

  const handleOpenPayment = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = () => {
    if (!id || !proofFile) {
      showError('Please select a file to upload.');
      return;
    }
    paymentMutation.mutate({ courseId: Number(id), file: proofFile });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner text={t('common.loading', 'Loading...')} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 flex justify-center items-center transition-colors duration-300">
        <div className="w-full max-w-lg">
          <ErrorMessage 
            title={t('common.noData', 'Course Not Found')} 
            message={t('common.noData', 'We could not load the details for this course.')} 
            onRetry={() => refetch()} 
          />
          <div className="mt-8 flex justify-center">
            <Link to="/courses">
              <Button variant="outline">{t('courses.backToCatalog', 'Back to Catalog')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const chapters = course.chapters || [];
  const lectureCount = chapters.reduce((count, chapter) => count + (chapter.lectures?.length || 0), 0);
  const paymentStatus = latestPayment?.status || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Premium Hero Header Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 mix-blend-overlay">
          <img 
            src={`https://source.unsplash.com/random/1200x800?education,technology&sig=${course.id}`} 
            alt="Course background"
            className="w-full h-full object-cover object-center mask-image-l"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">
                <BookOpen className="h-4 w-4 text-primary-400" />
                {course.status}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight text-balance">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
                {course.description || 'No description available for this course.'}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-300 font-medium bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-secondary-400" />
                  <span className="text-white">{course.instructor?.user?.name || 'Expert Instructor'}</span>
                </div>
                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-400" />
                  <span className="text-white">{lectureCount} Lectures</span>
                </div>
                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  <span className="text-white">Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column - Curriculum */}
          <div className="lg:col-span-2 space-y-8 lg:-mt-24 relative z-20">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{t('courses.content', 'Course Content')}</h2>
              </div>
              
              {chapters.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                  <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">{t('common.comingSoon', 'Coming Soon')}</p>
                  <p>{t('common.noData', 'Course material is currently being prepared.')}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="group">
                      <div className="bg-slate-50/80 dark:bg-slate-800/50 px-8 py-5 flex justify-between items-center group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/10 transition-colors">
                        <h3 className="font-bold text-slate-900 dark:text-white">{chapter.title}</h3>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          {chapter.lectures?.length || 0} {t('courses.lectures', 'lectures')}
                        </span>
                      </div>
                      <div className="divide-y divide-slate-50 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                        {(chapter.lectures || []).map((lecture: Lecture) => (
                          <div 
                            key={lecture.id} 
                            onClick={() => handleOpenLecture(lecture.id)}
                            className={`px-8 py-4 flex items-center justify-between transition-all ${
                              isEnrolled ? 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:ltr:pl-10 hover:rtl:pr-10 cursor-pointer' : 'opacity-70 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl transition-colors ${isEnrolled ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                {isEnrolled ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className={`font-medium transition-colors ${isEnrolled ? 'text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300' : 'text-slate-700 dark:text-slate-400'}`}>
                                  {lecture.title}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1.5 mt-0.5">
                                  {lecture.content_type === 'video' ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                  {lecture.content_type}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                              {lecture.duration ? `${lecture.duration} min` : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Instructor Card */}
            <Card className="border-0 shadow-soft overflow-hidden dark:bg-slate-900 transition-colors duration-300">
              <div className="p-8">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6">{t('courses.instructor', 'About the Instructor')}</h3>
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center text-2xl font-black shadow-sm shrink-0">
                    {course.instructor?.user?.name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{course.instructor?.user?.name || 'Expert Instructor'}</div>
                    <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">{t('courses.author', 'Course Author')}</div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {t('common.noData', 'No bio available.')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:-mt-32 relative z-30">
            <Card className="p-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-700 sticky top-24 rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6">
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-2">{t('courses.investment', 'Investment')}</div>
                <div className="text-5xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-baseline gap-1">
                  {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : t('common.free', 'Free')}
                </div>

                <div className="space-y-5">
                  {isEnrolled ? (
                    <div className="bg-secondary-50 dark:bg-secondary-900/20 text-secondary-900 dark:text-secondary-100 border border-secondary-200 dark:border-secondary-800 p-5 rounded-xl flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-secondary-600 dark:text-secondary-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-lg">{t('courses.readyToLearn', 'Ready to Learn')}</div>
                        <div className="text-sm mt-1 text-secondary-700 dark:text-secondary-300 leading-relaxed">{t('courses.accessGranted', 'You have full lifetime access to this course.')}</div>
                      </div>
                    </div>
                  ) : paymentStatus ? (
                    <PaymentStatusPanel status={paymentStatus} />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-start gap-3">
                      <Lock className="h-6 w-6 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white">{t('courses.enrollmentRequired', 'Enrollment Required')}</div>
                        <div className="text-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{t('courses.secureSpot', 'Secure your spot by submitting your payment.')}</div>
                      </div>
                    </div>
                  )}

                  {isEnrolled ? (
                    <Link to={`/student/courses/${course.id}/learn`} className="block">
                      <Button className="w-full h-14 text-lg font-bold shadow-glow-secondary bg-secondary-600 hover:bg-secondary-700 text-white">
                        <Play className="h-6 w-6 ltr:mr-2 rtl:ml-2 fill-current" /> {t('courses.startLearning', 'Start Learning')}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full h-14 text-lg font-bold shadow-glow-primary text-white" 
                      onClick={handleOpenPayment}
                      disabled={paymentMutation.isPending || paymentStatus === 'pending' || paymentStatus === 'under_review'}
                    >
                      <Upload className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                      {paymentStatus === 'rejected' ? t('common.tryAgain', 'Try Again') : t('courses.enrollNow', 'Enroll Now')}
                    </Button>
                  )}
                  
                  {!isEnrolled && (
                    <p className="text-center text-xs font-medium text-slate-400 pt-2">
                      {t('courses.securePayment', 'Secure payment verification process')}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute ltr:right-4 rtl:left-4 top-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-5">
              <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">{t('payment.uploadProof', 'Upload Proof')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              {t('payment.uploadInstructions', 'Upload a clear image or PDF of your payment receipt. Once verified, you will instantly gain access.')}
            </p>

            <label className="block border-2 border-dashed border-primary-200 dark:border-primary-800 rounded-xl p-8 bg-primary-50/50 dark:bg-primary-900/10 text-center mb-8 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition cursor-pointer relative group">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-primary-400 dark:text-primary-500 mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
              <div className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {proofFile ? proofFile.name : t('payment.clickToUpload', 'Click or drag file to upload')}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('payment.fileLimits', 'PDF, JPG, PNG up to 10MB')}</div>
            </label>

            <Button 
              className="w-full h-12 text-base font-bold text-white" 
              onClick={handleSubmitPayment}
              isLoading={paymentMutation.isPending}
              disabled={!proofFile}
            >
              {t('payment.submitProof', 'Submit Proof')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
