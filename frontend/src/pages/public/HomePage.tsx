import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Star, Award, ChevronLeft, ArrowLeft, PlayCircle, Monitor, FileBadge, CheckCircle2, X } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';

// ===================== Modals =====================

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="bg-white rounded-3xl shadow-2xl z-10 w-full max-w-lg overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ===================== HomePage =====================

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{title: string; desc: string; fullDesc: string; icon: any; color: string; bg: string} | null>(null);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['public-courses'],
    queryFn: () => api.get('/courses').then(r => (r.data as any).data || r.data),
  });

  if (!authLoading && isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const features = [
    { title: 'نخبة من المدربين', desc: 'تدريب احترافي على يد خبراء معتمدين', fullDesc: 'نحن ننتقي مدربينا بعناية لضمان حصولك على أفضل جودة تعليمية. جميع مدربينا لديهم خبرة عملية طويلة في سوق العمل ومؤهلون لتوصيل المعلومة بأسلوب حديث ومبسط.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'مناهج حديثة', desc: 'محتوى متجدد يواكب سوق العمل', fullDesc: 'لأن التكنولوجيا والعالم يتغيران بسرعة، نقوم بتحديث مناهجنا بشكل دوري لضمان أن المهارات التي تكتسبها هي المطلوبة فعلياً اليوم وغداً.', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'تدريب عملي', desc: 'تطبيق حقيقي للمفاهيم المدروسة', fullDesc: 'نؤمن أن الممارسة هي أساس التعلم. دوراتنا تعتمد على الجانب التطبيقي بنسبة تتجاوز 70% لضمان جاهزيتك التامة.', icon: Monitor, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'شهادات معتمدة', desc: 'شهادات تزيد من فرصك المهنية', fullDesc: 'عند إتمامك لأي من برامجنا واجتيازك التقييم النهائي، ستحصل على شهادة موثقة ومعتمدة تعزز سيرتك الذاتية وتفتح لك أبواباً مهنية جديدة.', icon: FileBadge, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20 selection:text-primary" dir="rtl">
      
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">4A</span>
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">أكاديمية فور أيه</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-primary transition-colors">من نحن</a>
            <a href="#courses" className="hover:text-primary transition-colors">الكورسات</a>
            <a href="#features" className="hover:text-primary transition-colors">المميزات</a>
          </div>
          <div>
            {isAuthenticated ? (
              <Link to={`/${user?.role}/dashboard`} className="btn-primary text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/30 flex items-center gap-2">
                لوحة التحكم <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/30">
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/20 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-10 rounded-full translate-x-1/3 -translate-y-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-bold mb-8">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> التعليم المستقبلي يبدأ من هنا
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} 
            className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight mb-6">
            طوّر مهاراتك مع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">أكاديمية فور أيه</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} 
            className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة تعليمية متكاملة تقدم دورات احترافية في مختلف المجالات بأحدث الأساليب التقنية والتطبيقية. انضم إلينا اليوم وابدأ رحلة نجاحك المهني.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#courses" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              استكشف الكورسات <ChevronLeft className="w-5 h-5" />
            </a>
            <a href="#about" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" /> تعرف علينا
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                نحن نصنع قادة الغد من خلال تعليم مبتكر وتطبيقي.
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                أكاديمية فور أيه ليست مجرد منصة تعليمية، بل هي شريكك الاستراتيجي في بناء مستقبلك. نؤمن بأن التعليم المتميز يجب أن يجمع بين الأسس النظرية القوية والتطبيق العملي المكثف.
              </p>
              <ul className="space-y-4">
                {[
                  'منهجيات تدريب متطورة تلائم احتياجات السوق.',
                  'متابعة مستمرة وتقييم شامل لكل طالب.',
                  'بيئة تعليمية تفاعلية تحفز على الإبداع.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-slate-100 to-indigo-50/50 relative overflow-hidden p-8 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-slate-100 rounded-full" />
                  <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded-full mt-auto" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-amber-400 rounded-full blur-2xl opacity-40 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">لماذا تختار فور أيه؟</h2>
            <p className="text-slate-500">نقدم لك بيئة متكاملة تضمن لك التفوق والوصول لأهدافك بأسرع وأكفأ الطرق الممكنة.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedFeature(feature)}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center group">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-6 text-primary text-sm font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  اقرأ المزيد <ChevronLeft className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section id="courses" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black text-slate-900 mb-4">أحدث الكورسات التدريبية</h2>
              <p className="text-slate-500">مجموعة منتقاة من الكورسات المصممة لتطوير مهاراتك من الصفر وحتى الاحتراف.</p>
            </div>
            {isAuthenticated ? (
              <Link to="/courses" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                عرض كل الكورسات <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                سجل الآن للاشتراك <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-indigo-50 relative p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> متاح
                      </span>
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-xl font-black text-slate-900 drop-shadow-sm">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
                      {course.description || 'كورس شامل يغطي كافة الجوانب النظرية والتطبيقية بأسلوب مبسط وعملي.'}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {course.instructor?.user?.name?.[0] || 'A'}
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{course.instructor?.user?.name || 'مدرب معتمد'}</span>
                      </div>
                      <button onClick={() => setSelectedCourse(course)} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        تفاصيل أكثر <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-black text-xl">4A</span>
          </div>
          <p className="text-lg font-bold text-white mb-2">أكاديمية فور أيه للتدريب والاستشارات</p>
          <p className="text-sm mb-8">خطوتك الأولى نحو مستقبل مشرق والتميز الأكاديمي والمهني.</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">تواصل معنا</a>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-xs">
            © {new Date().getFullYear()} أكاديمية فور أيه. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      {/* ─── Course Details Modal ─── */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)}>
        {selectedCourse && (
          <div className="p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{selectedCourse.title}</h3>
            <p className="text-primary font-black text-xl mb-6">{selectedCourse.price}$</p>
            
            <div className="space-y-4 mb-8">
              <p className="text-slate-600 leading-relaxed">
                {selectedCourse.description || 'هذا الكورس مصمم لتزويدك بالمهارات الأساسية والمتقدمة في هذا المجال. يعتمد على الشرح النظري المدعوم بالتطبيق العملي والمشاريع الحقيقية لضمان استيعابك الكامل للمادة العلمية.'}
              </p>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">المدرب</p>
                  <p className="text-sm font-bold text-slate-900">{selectedCourse.instructor?.user?.name || 'مدرب معتمد من الأكاديمية'}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 mb-1">المدة</p>
                  <p className="text-sm font-bold text-slate-900">حسب خطة الكورس</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/login" className="flex-1 btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/30">
                تسجيل الدخول للاشتراك
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Feature Details Modal ─── */}
      <Modal isOpen={!!selectedFeature} onClose={() => setSelectedFeature(null)}>
        {selectedFeature && (
          <div className="p-8 text-center">
            <div className={`w-20 h-20 mx-auto rounded-3xl ${selectedFeature.bg} flex items-center justify-center mb-6`}>
              <selectedFeature.icon className={`w-10 h-10 ${selectedFeature.color}`} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{selectedFeature.title}</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              {selectedFeature.fullDesc}
            </p>
            <button onClick={() => setSelectedFeature(null)} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              حسناً، فهمت
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default HomePage;
