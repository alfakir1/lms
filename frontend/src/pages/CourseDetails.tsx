import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Users, Layout, Mail, MessageSquare, PlayCircle, Clock } from 'lucide-react';
import { useCourse, useEnroll, useCourseReviews, useAddReview } from '../hooks/useCourses';
import { useEnrollments } from '../hooks/useEnrollments';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ManageLessonsModal from '../components/ManageLessonsModal';


const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLang();
  
  const courseId = Number(id);
  const { data: course, isLoading, error } = useCourse(courseId);
  const { data: enrollments = [], error: enrollmentsError } = useEnrollments(courseId);
  const { data: reviews = [] } = useCourseReviews(courseId);
  const addReviewMutation = useAddReview();
  const enrollMutation = useEnroll();
  
  const [selectedInstanceId, setSelectedInstanceId] = React.useState<number | null>(null);
  const [showManageLessons, setShowManageLessons] = React.useState(false);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-600">تعذر تحميل بيانات الكورس. يرجى المحاولة مرة أخرى.</div>;
  if (!course) return <div className="text-center py-20">لم يتم العثور على الكورس</div>;

  const handleEnroll = async () => {
    const targetId = selectedInstanceId || course.id;
    try {
      await enrollMutation.mutateAsync(targetId);
      navigate(`/courses/${targetId}/play`);
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'حدث خطأ أثناء التسجيل. قد تكون مسجلاً بالفعل.';
      alert(errorMsg);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      await addReviewMutation.mutateAsync({
        courseId: course.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewComment('');
      setReviewRating(5);
    } catch (e) {
      alert('فشل إضافة التقييم. قد تكون قد قيمت هذا الكورس مسبقاً.');
    }
  };

  const isInstructorOrAdmin = user?.role === 'admin' || (user?.role === 'instructor' && course?.instructor_id === user?.instructor?.id);
  const isEnrolled = enrollments.some(e => e.student_id === user?.student?.id);
  const courseLessons = course?.lessons || [];
  const courseInstances = course?.instances || [];

  return (
    <div className="space-y-8 -mt-6 -mx-6">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white px-6 py-12 md:py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">برمجة</span>
              <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" /> {(course as any)?.average_rating || '0.0'} ({reviews.length} تقييم)
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              {course.description || 'كورس متميز لتطوير مهاراتك والوصول لمستوى احترافي.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2"><Layout className="w-5 h-5 text-slate-500" /> {courseLessons.length || (course as any)?.lessons_count || 0} درس</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-slate-500" /> 12 ساعة</span>
              <span className="flex items-center gap-2"><Users className="w-5 h-5 text-slate-500" /> {enrollments.length || (course as any)?.enrollments_count || 0} طالب</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Teaching Groups Selection */}
          {user?.role === 'student' && courseInstances.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border-2 border-primary/20 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="text-primary w-6 h-6" /> اختر المجموعة التعليمية والمحاضر
              </h2>
              <p className="text-slate-500 text-sm mb-6">يرجى اختيار المحاضر الذي تود الانضمام لمجموعته:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courseInstances.map((instance) => (
                  <div 
                    key={instance.id}
                    onClick={() => setSelectedInstanceId(instance.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedInstanceId === instance.id 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={`https://i.pravatar.cc/150?u=${instance.instructor?.id}`} alt="instructor" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">م. {instance.instructor?.user?.name || (instance.instructor as any)?.name || 'غير معروف'}</p>
                        <p className="text-xs text-slate-500">{instance.group_name || 'مجموعة دراسية'}</p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">محتوى الكورس</h2>
                {isInstructorOrAdmin && (
                    <Button variant="secondary" onClick={() => setShowManageLessons(true)} className="text-xs py-2">
                        إدارة المحتوى
                    </Button>
                )}
            </div>
            <div className="space-y-3">
              {courseLessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{lesson.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{lesson.duration ? `${Math.floor(lesson.duration / 60)} دقيقة` : 'فيديو'}</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-slate-300 shrink-0" />
                </div>
              ))}
              {!courseLessons.length && <p className="text-slate-500 text-sm">لم يتم إضافة دروس بعد.</p>}
            </div>
          </div>

          {isInstructorOrAdmin && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">الطلاب المسجلين</h2>
                <Users className="text-slate-400 w-6 h-6" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase">اسم الطالب</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase text-center">حالة الدفع</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase text-left">التواصل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                              {enrollment.student?.user?.name?.[0]}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{enrollment.student?.user?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            enrollment.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {enrollment.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                          </span>
                        </td>
                        <td className="py-4 text-left">
                          <a href={`mailto:${enrollment.student?.user?.email}`} className="inline-flex p-2 bg-slate-50 rounded-lg text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {(enrollments.length === 0 || enrollmentsError) && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 text-sm italic">لا يوجد طلاب مسجلين بعد.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-primary w-6 h-6" /> آراء الطلاب والتقييمات
              </h2>
            </div>

            {isEnrolled && (
              <form onSubmit={handleAddReview} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <p className="font-bold text-sm text-slate-700">ما هو رأيك في هذا الكورس؟</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                        reviewRating >= star ? 'text-amber-400 bg-amber-50' : 'text-slate-300 hover:text-slate-400 bg-white'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${reviewRating >= star ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-0 text-sm h-24"
                />
                <Button type="submit" loading={addReviewMutation.isPending} className="w-full">
                  إرسال التقييم
                </Button>
              </form>
            )}

            <div className="space-y-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 shrink-0 uppercase">
                    {review.user?.name?.[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{review.user?.name}</p>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(review.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="py-10 text-center opacity-40">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-bold">لا توجد تقييمات بعد.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
            <div className="w-full h-48 bg-slate-200 rounded-2xl overflow-hidden mb-6 relative group">
              <img src={`https://picsum.photos/seed/${course.id}/400/300`} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors cursor-pointer">
                <PlayCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-black text-slate-900">{course.price}$</span>
              <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">خصم 20%</span>
            </div>

            {user?.role === 'student' ? (
              <Button 
                onClick={handleEnroll} 
                loading={enrollMutation.isPending} 
                disabled={courseInstances.length > 0 && !selectedInstanceId}
                className="w-full py-4 text-lg"
              >
                {courseInstances.length > 0 && !selectedInstanceId ? 'اختر مجموعة للتسجيل' : 'سجل الآن'}
              </Button>
            ) : (
              <Button variant="secondary" className="w-full py-4" onClick={() => navigate(`/courses/${course.id}/play`)}>
                معاينة الكورس
              </Button>
            )}

            <ul className="mt-6 space-y-3 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> وصول مدى الحياة</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> شهادة إتمام</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> ملفات وملحقات للتحميل</li>
            </ul>
          </div>
        </div>
      </div>

      {showManageLessons && (
          <ManageLessonsModal 
            courseId={course.id} 
            lessons={courseLessons} 
            onClose={() => setShowManageLessons(false)} 
          />
      )}
    </div>
  );
};

export default CourseDetails;
