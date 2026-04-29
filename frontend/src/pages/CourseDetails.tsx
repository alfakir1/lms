import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourse, useEnroll } from '../hooks/useCourses';
import { useEnrollments } from '../hooks/useEnrollments';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLang } from '../context/LangContext';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { lang, t, dir } = useLang();
  
  const { data: course, isLoading } = useCourse(Number(id));
  const isInstructorOrAdmin = !!user && (user.role === 'admin' || user.role === 'super_admin' || (user.role === 'instructor' && course?.instructor_id === user.instructor?.id));
  const { data: enrollments } = useEnrollments(Number(id), isInstructorOrAdmin);
  const enrollMutation = useEnroll();

  if (isLoading) return <LoadingSpinner />;
  if (!course) return (
    <div className="flex flex-col items-center justify-center py-40">
       <span className="material-symbols-outlined text-7xl text-slate-200 mb-6">error</span>
       <p className="text-xl font-bold text-slate-400">{lang === 'ar' ? 'لم يتم العثور على الكورس' : 'Course Not Found'}</p>
    </div>
  );

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      await enrollMutation.mutateAsync(course.id);
      navigate(`/courses/${course.id}/play`);
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div className="space-y-10">
      {/* Premium Hero Banner */}
      <div className="relative rounded-[3rem] bg-slate-900 overflow-hidden min-h-[400px] flex items-center p-8 lg:p-20 shadow-2xl border border-white/5">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-container/20 via-transparent to-emerald-500/10 opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full">
           <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary-container/20 text-primary-container rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-container/20">
                   Premium Course
                 </span>
                 <div className="flex items-center gap-1 text-amber-400 text-sm font-black">
                   <span className="material-symbols-outlined text-sm fill-icon">star</span> 4.9
                 </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                {course.title}
              </h1>
              
              <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                {course.description || (lang === 'ar' ? 'تعلم المهارات الاحترافية التي تؤهلك لسوق العمل مع خبراء المجال في أكاديمية فور أيه.' : 'Master the professional skills that qualify you for the job market with industry experts at 4A Academy.')}
              </p>
              
              <div className="flex flex-wrap items-center gap-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">video_library</span>
                    {course.lessons?.length || 0} {lang === 'ar' ? 'دروس' : 'Lessons'}
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    12+ {lang === 'ar' ? 'ساعة' : 'Hours'}
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">group</span>
                    {enrollments?.length || 0} {lang === 'ar' ? 'طالب' : 'Students'}
                 </div>
              </div>
           </div>
           
           <div className="hidden lg:block relative group">
              <div className="aspect-video bg-slate-800 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src={`https://picsum.photos/seed/${course.id}/800/450`} alt="cover" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <button className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-all shadow-2xl group-hover:bg-primary-container group-hover:border-transparent">
                        <span className="material-symbols-outlined text-4xl fill-icon">play_arrow</span>
                     </button>
                  </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-10">
           {/* Curriculum Section */}
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{lang === 'ar' ? 'منهج الدورة التدريبية' : 'Course Curriculum'}</h2>
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{course.lessons?.length || 0} {lang === 'ar' ? 'دروس' : 'Lessons'}</span>
              </div>
              
              <div className="space-y-4">
                 {course.lessons?.map((lesson, idx) => (
                   <div key={lesson.id} className="group flex items-center gap-6 p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary-container/30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center text-sm font-black group-hover:bg-primary-container group-hover:text-white transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{lesson.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>15:00 {lang === 'ar' ? 'دقيقة' : 'Min'}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span className="text-primary-container">Video Lecture</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary-container transition-colors">play_circle</span>
                   </div>
                 ))}
                 {!course.lessons?.length && (
                   <div className="py-10 text-center text-slate-400 italic">
                      {lang === 'ar' ? 'لم يتم إضافة دروس بعد لهذا المنهج.' : 'No lessons have been added to this curriculum yet.'}
                   </div>
                 )}
              </div>
           </div>

           {/* Instructor Section */}
           {isInstructorOrAdmin && enrollments && (
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{lang === 'ar' ? 'إدارة الطلاب' : 'Student Management'}</h2>
                   <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <span className="material-symbols-outlined text-xs">group</span>
                      {enrollments.length} {lang === 'ar' ? 'مسجلين' : 'Enrolled'}
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-start">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="pb-6 text-start">{lang === 'ar' ? 'اسم الطالب' : 'Student'}</th>
                           <th className="pb-6 text-center">{lang === 'ar' ? 'حالة الدفع' : 'Payment'}</th>
                           <th className="pb-6 text-center">{lang === 'ar' ? 'التقدم' : 'Progress'}</th>
                           <th className="pb-6 text-end">{lang === 'ar' ? 'الإجراء' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {enrollments.map((e) => (
                          <tr key={e.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                             <td className="py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-xs font-black text-primary-container">
                                      {e.student?.user?.name?.[0]}
                                   </div>
                                   <span className="text-sm font-bold text-slate-900 dark:text-white">{e.student?.user?.name}</span>
                                </div>
                             </td>
                             <td className="py-6 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${e.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                   {e.payment_status}
                                </span>
                             </td>
                             <td className="py-6 text-center">
                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full mx-auto overflow-hidden">
                                   <div className="h-full bg-primary-container transition-all" style={{ width: `${e.progress_percent || 0}%` }} />
                                </div>
                             </td>
                             <td className="py-6 text-end">
                                <button className="p-2 text-slate-400 hover:text-primary-container transition-colors">
                                   <span className="material-symbols-outlined text-lg">mail</span>
                                </button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}
        </div>

        {/* Right Column: Pricing & Enrollment */}
        <div className="space-y-10">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/5 shadow-xl sticky top-24">
              <div className="text-center mb-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{lang === 'ar' ? 'سعر الدورة' : 'Course Investment'}</p>
                 <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${course.price}</span>
                    <span className="text-slate-400 text-lg line-through opacity-50">${course.price * 1.5}</span>
                 </div>
              </div>
              
              <div className="space-y-4 mb-10">
                {user?.role === 'student' ? (
                  <button 
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    className="w-full bg-primary-container text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {lang === 'ar' ? 'سجل الآن' : 'Enroll Now'}
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate(`/courses/${course.id}/play`)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">play_circle</span>
                    {lang === 'ar' ? 'معاينة الدروس' : 'Preview Lessons'}
                  </button>
                )}
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">{lang === 'ar' ? 'ضمان استعادة الأموال لمدة 30 يوم' : '30-Day Money Back Guarantee'}</p>
              </div>
              
              <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-4">
                 {[
                   { icon: 'workspace_premium', label: lang === 'ar' ? 'شهادة معتمدة' : 'Official Certificate' },
                   { icon: 'all_inclusive', label: lang === 'ar' ? 'وصول مدى الحياة' : 'Lifetime Access' },
                   { icon: 'devices', label: lang === 'ar' ? 'متوفر على كل الأجهزة' : 'Access on All Devices' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
                      <span className="material-symbols-outlined text-primary-container text-lg">{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Newsletter / Support Box */}
           <div className="bg-primary-container rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-4">{lang === 'ar' ? 'هل لديك أسئلة؟' : 'Have Questions?'}</h3>
                 <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">
                   {lang === 'ar' ? 'فريق الدعم الفني لدينا متاح دائماً لمساعدتك في رحلتك التعليمية.' : 'Our technical support team is always available to help you in your learning journey.'}
                 </p>
                 <button className="bg-white text-primary-container px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                   {lang === 'ar' ? 'تواصل معنا' : 'Contact Support'}
                 </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/5 group-hover:scale-110 transition-transform duration-700">help</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

