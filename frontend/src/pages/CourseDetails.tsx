import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Star, CheckCircle, Users, Layout } from 'lucide-react';
import { useCourse, useEnroll } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: course, isLoading } = useCourse(Number(id));
  const enrollMutation = useEnroll();

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-20">لم يتم العثور على الكورس</div>;

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(course.id);
      navigate(`/courses/${course.id}/play`);
    } catch (e) {
      alert('حدث خطأ أثناء التسجيل. قد تكون مسجلاً بالفعل.');
    }
  };

  return (
    <div className="space-y-8 -mt-6 -mx-6">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white px-6 py-12 md:py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">برمجة</span>
              <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" /> 4.9 (120 تقييم)
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              {course.description || 'كورس متميز لتطوير مهاراتك والوصول لمستوى احترافي.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2"><Layout className="w-5 h-5 text-slate-500" /> {course.lessons?.length || 0} درس</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-slate-500" /> 12 ساعة</span>
              <span className="flex items-center gap-2"><Users className="w-5 h-5 text-slate-500" /> 84 طالب</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">محتوى الكورس</h2>
            <div className="space-y-3">
              {course.lessons?.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{lesson.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">15:00 دقيقة</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-slate-300 shrink-0" />
                </div>
              ))}
              {!course.lessons?.length && <p className="text-slate-500 text-sm">لم يتم إضافة دروس بعد.</p>}
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
              <Button onClick={handleEnroll} loading={enrollMutation.isPending} className="w-full py-4 text-lg">
                سجل الآن
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
    </div>
  );
};

export default CourseDetails;
