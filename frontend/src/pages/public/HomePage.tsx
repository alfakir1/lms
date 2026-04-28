import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, Users, Star, Award, ChevronLeft, ArrowLeft, 
  PlayCircle, Monitor, FileBadge, CheckCircle2, X, 
  Globe, Moon, Sun, GraduationCap, ChevronRight, Zap
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { Course } from '../../types';

// ===================== Modals =====================

const Modal = ({ isOpen, onClose, children, dir }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; dir: string }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={dir}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="bg-card border border-border rounded-[2.5rem] shadow-2xl z-10 w-full max-w-lg overflow-hidden relative">
          <button onClick={onClose} className="absolute top-6 left-6 p-2 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors z-10">
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
  const { lang, dir, toggle: toggleLang, t } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['public-courses'],
    queryFn: () => api.get('/courses').then(r => (r.data as any).data || r.data),
    retry: false,
  });

  if (!authLoading && isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const features = [
    { key: 'feat1', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { key: 'feat2', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { key: 'feat3', icon: Monitor, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { key: 'feat4', icon: FileBadge, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 selection:bg-primary/20 selection:text-primary" dir={dir}>
      
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="font-black text-xl text-foreground tracking-tight uppercase">4A Academy</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">{lang === 'ar' ? 'من نحن' : 'About'}</a>
            <a href="#courses" className="hover:text-primary transition-colors">{lang === 'ar' ? 'الكورسات' : 'Courses'}</a>
            <a href="#features" className="hover:text-primary transition-colors">{lang === 'ar' ? 'المميزات' : 'Features'}</a>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2.5 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
             <button onClick={toggleLang} className="px-3 py-1.5 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-xs font-black">
                {lang === 'ar' ? 'EN' : 'العربية'}
             </button>
             <div className="h-6 w-px bg-border mx-1" />
             <Link to="/login" className="btn-primary text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20">
                {lang === 'ar' ? 'دخول' : 'Sign In'}
             </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-sm">
            <Zap className="w-4 h-4 fill-primary" /> {lang === 'ar' ? 'مستقبل التعليم هنا' : 'The Future of Learning is Here'}
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
            className="text-5xl lg:text-8xl font-black text-foreground leading-[1.1] tracking-tighter mb-8">
            {lang === 'ar' ? <>طوّر مهاراتك مع <br/><span className="text-primary">أكاديمية فور أيه</span></> : <>Master Your Skills <br/><span className="text-primary">At 4A Academy</span></>}
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            {lang === 'ar' 
              ? 'نحن نوفر لك أفضل الأدوات والمناهج لتصبح خبيراً في مجالك. انضم إلى الآلاف من الطلاب الذين بدأوا رحلتهم معنا.' 
              : 'Empowering you with the best tools and curriculums to become an expert in your field. Join thousands of students already learning with us.'}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#courses" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              {lang === 'ar' ? 'ابدأ التعلم الآن' : 'Start Learning Now'} {dir === 'rtl' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </a>
            <a href="#about" className="w-full sm:w-auto px-10 py-5 bg-card text-foreground rounded-2xl font-black text-lg border border-border shadow-sm hover:bg-muted hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-6 h-6 text-primary" /> {lang === 'ar' ? 'من نحن' : 'Who We Are'}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats / Trust ─── */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { label: lang === 'ar' ? 'طالب نشط' : 'Active Students', val: '5K+' },
                  { label: lang === 'ar' ? 'دورة تدريبية' : 'Premium Courses', val: '120+' },
                  { label: lang === 'ar' ? 'مدرب خبير' : 'Expert Trainers', val: '45+' },
                  { label: lang === 'ar' ? 'نسبة النجاح' : 'Success Rate', val: '98%' },
              ].map((s, i) => (
                  <div key={i} className="text-center">
                      <p className="text-3xl font-black text-foreground mb-1">{s.val}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                <Award className="w-4 h-4" /> {lang === 'ar' ? 'لماذا نحن؟' : 'Why Choose Us?'}
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tighter">
                {lang === 'ar' ? 'نصنع الفرق في مسيرتك المهنية.' : 'We Make a Difference in Your Career.'}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                {lang === 'ar' 
                  ? 'أكاديمية فور أيه هي بيئة تعليمية متكاملة تهدف إلى تمكين الشباب العربي بمهارات سوق العمل الحقيقية من خلال مشاريع عملية ومناهج تطبيقية مكثفة.' 
                  : '4A Academy is an integrated learning environment aimed at empowering youth with real-world market skills through practical projects and intensive applied curricula.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  lang === 'ar' ? 'مدربين معتمدين دولياً' : 'Globally Certified Trainers',
                  lang === 'ar' ? 'دعم فني وتوجيه مهني' : 'Technical & Career Support',
                  lang === 'ar' ? 'شهادات موثقة' : 'Verified Certificates',
                  lang === 'ar' ? 'مشاريع عملية حقيقية' : 'Real Practical Projects'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-foreground bg-muted/50 p-4 rounded-2xl border border-border/50">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-[4/5] rounded-[3rem] bg-gradient-to-tr from-primary/20 via-background to-secondary/10 border border-border relative overflow-hidden p-1">
                 <div className="w-full h-full bg-card rounded-[2.8rem] flex flex-col p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                        </div>
                        <div className="px-3 py-1 bg-primary/10 rounded-lg text-[10px] font-black text-primary uppercase">Code Preview</div>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="w-[80%] h-4 bg-muted rounded animate-pulse" />
                        <div className="w-[60%] h-4 bg-muted rounded animate-pulse delay-75" />
                        <div className="w-[90%] h-4 bg-muted rounded animate-pulse delay-150" />
                        <div className="w-[40%] h-4 bg-muted rounded animate-pulse delay-300" />
                    </div>
                    <div className="mt-auto bg-primary/5 border border-primary/20 rounded-2xl p-6">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-primary rounded-xl" />
                             <div>
                                 <div className="h-4 w-24 bg-foreground/10 rounded mb-2" />
                                 <div className="h-3 w-16 bg-foreground/5 rounded" />
                             </div>
                         </div>
                    </div>
                 </div>
                 {/* Floating Badges */}
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-[-20px] bg-card border border-border p-4 rounded-2xl shadow-xl z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><CheckCircle2 /></div>
                    <div>
                        <p className="text-xs font-black text-foreground">Verified Student</p>
                        <p className="text-[10px] text-muted-foreground font-bold">100% Secure</p>
                    </div>
                 </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-primary font-black uppercase tracking-widest text-xs mb-4">{lang === 'ar' ? 'المميزات' : 'Our Features'}</div>
            <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-6 tracking-tighter">{lang === 'ar' ? 'تجربة تعلم لا مثيل لها' : 'Unmatched Learning Experience'}</h2>
            <p className="text-muted-foreground text-lg font-medium">{lang === 'ar' ? 'نحن لا نقدم مجرد دروس، بل نبني مستقبلاً.' : 'We don\'t just provide lessons; we build futures.'}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} 
                className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full" />
                <div className={`w-20 h-20 rounded-3xl ${f.bg} flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-6`}>
                  <f.icon className={`w-10 h-10 ${f.color}`} />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{lang === 'ar' ? t(`feat_title_${i+1}`) || 'ميزة احترافية' : 'Premium Feature'}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                   {lang === 'ar' ? 'نوفر لك كافة الأدوات اللازمة للنجاح والتميز في مجالك المهني.' : 'We provide you with all the tools necessary for success and excellence.'}
                </p>
                <div className="mt-8 pt-6 border-t border-border/50">
                    <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                        {lang === 'ar' ? 'اقرأ المزيد' : 'Learn More'} <ChevronRight className={`w-4 h-4 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section id="courses" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-3xl">
              <div className="text-primary font-black uppercase tracking-widest text-xs mb-4">{lang === 'ar' ? 'الدورات' : 'Course Catalog'}</div>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-6 tracking-tighter">{lang === 'ar' ? 'استكشف مساراتك' : 'Explore Your Path'}</h2>
              <p className="text-muted-foreground text-lg font-medium">{lang === 'ar' ? 'ابدأ رحلة التعلم مع أفضل المناهج التدريبية.' : 'Start your learning journey with the best training curricula.'}</p>
            </div>
            <Link to="/login" className="btn-primary px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 flex items-center gap-3">
              {lang === 'ar' ? 'عرض كافة الدورات' : 'View All Courses'} <ArrowLeft className={`w-6 h-6 ${dir === 'ltr' && 'rotate-180'}`} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.slice(0, 6).map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full relative">
                  
                  <div className="h-64 bg-muted relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 mix-blend-overlay z-10" />
                     <div className="absolute inset-0 flex items-center justify-center p-12 text-center z-20">
                         <h3 className="text-3xl font-black text-white drop-shadow-lg">{course.title}</h3>
                     </div>
                     <div className="absolute top-6 left-6 z-30">
                        <span className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-primary border border-white/20 shadow-xl flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ar' ? 'متاح الآن' : 'ENROLLING NOW'}
                        </span>
                     </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1 z-20 bg-card">
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium line-clamp-3 flex-1 mb-8">
                      {course.description || (lang === 'ar' ? 'كورس شامل ومكثف يهدف إلى تزويدك بالمهارات المطلوبة في سوق العمل.' : 'A comprehensive and intensive course aimed at providing you with the skills required in the job market.')}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-border pt-8 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                          {course.instructor?.user?.name?.[0] || 'A'}
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? 'المدرب' : 'Instructor'}</p>
                           <p className="text-sm font-black text-foreground">{course.instructor?.user?.name || (lang === 'ar' ? 'خبير معتمد' : 'Expert Trainer')}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedCourse(course)} className="w-12 h-12 rounded-2xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center text-foreground group/btn">
                        <ChevronRight className={`w-6 h-6 transition-transform ${dir === 'rtl' && 'rotate-180'}`} />
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
      <footer className="bg-card text-muted-foreground py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/30">
            <GraduationCap className="text-primary-foreground w-8 h-8" />
          </div>
          <p className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">4A ACADEMY</p>
          <p className="text-lg font-medium max-w-2xl mx-auto mb-12">
            {lang === 'ar' ? 'خطوتك الأولى نحو الاحتراف والتميز في سوق العمل العالمي.' : 'Your first step towards professionalism and excellence in the global job market.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-black uppercase tracking-widest mb-16">
            <a href="#" className="hover:text-primary transition-colors">{lang === 'ar' ? 'الشروط' : 'Terms'}</a>
            <a href="#" className="hover:text-primary transition-colors">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</a>
            <a href="#" className="hover:text-primary transition-colors">{lang === 'ar' ? 'تواصل' : 'Contact'}</a>
            <a href="#" className="hover:text-primary transition-colors">{lang === 'ar' ? 'من نحن' : 'About'}</a>
          </div>
          <div className="pt-12 border-t border-border text-[10px] font-black tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} 4A Academy Smart Systems. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* ─── Details Modal ─── */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} dir={dir}>
        {selectedCourse && (
          <div className="p-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-2 leading-tight">{selectedCourse.title}</h3>
            <p className="text-primary font-black text-4xl mb-10">{selectedCourse.price}$</p>
            
            <div className="space-y-6 mb-12 text-muted-foreground font-medium leading-relaxed">
              <p>
                {selectedCourse.description || (lang === 'ar' ? 'هذا البرنامج التدريبي صمم خصيصاً ليجعلك تتقن المهارات المطلوبة بأعلى معايير الجودة العالمية.' : 'This training program is specifically designed to make you master the required skills at the highest global quality standards.')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-5 rounded-[1.5rem] border border-border/50">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{lang === 'ar' ? 'المدرب' : 'Trainer'}</p>
                      <p className="text-sm font-black text-foreground truncate">{selectedCourse.instructor?.user?.name || 'Academy Expert'}</p>
                  </div>
                  <div className="bg-muted/50 p-5 rounded-[1.5rem] border border-border/50">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{lang === 'ar' ? 'المستوى' : 'Level'}</p>
                      <p className="text-sm font-black text-foreground">{lang === 'ar' ? 'مبتدئ - متقدم' : 'Beginner - Adv'}</p>
                  </div>
              </div>
            </div>

            <Link to="/login" className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
               {lang === 'ar' ? 'اشترك الآن' : 'Enroll Now'} <ArrowLeft className={`w-6 h-6 ${dir === 'ltr' && 'rotate-180'}`} />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
