import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { Course } from '../../types';
import PublicNav from '../../components/public/PublicNav';

// ===================== Components =====================

const SectionHeading = ({ badge, title, subtitle, centered = false }: any) => {
  const { dir } = useLang();
  return (
    <div className={`mb-16 ${centered ? 'text-center max-w-4xl mx-auto' : 'text-start'}`}>
      <motion.span 
        initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-primary/20"
      >
        {badge}
      </motion.span>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl lg:text-7xl font-black text-on-background leading-[1.1] mb-8 tracking-tighter"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-on-surface-variant text-xl font-medium leading-relaxed max-w-2xl ml-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <div className={`h-1.5 w-32 bg-primary rounded-full mt-10 ${centered ? 'mx-auto' : 'ml-auto'}`}></div>
    </div>
  );
};

// ===================== HomePage =====================

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { lang, dir } = useLang();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['public-courses'],
    queryFn: () => api.get('/courses').then(r => (r.data as any).data || r.data),
    retry: false,
  });

  if (!authLoading && isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/20" dir={dir}>
      
      {/* ─── TopNavBar ─── */}
      <PublicNav />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary"
              >
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'أكاديمية معتمدة دولياً' : 'Globally Accredited Academy'}</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl lg:text-8xl font-black text-on-background leading-[1.05] tracking-tighter"
              >
                {lang === 'ar' ? <>اصنع مستقبلك مع <br/><span className="text-primary-container">4A Academy</span></> : <>Engineer Your Future with <br/><span className="text-primary-container">4A Academy</span></>}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl lg:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-2xl"
              >
                {lang === 'ar' 
                  ? 'انضم إلى منصة التعليم الرائدة التي تجمع بين الخبرة الأكاديمية والتقنيات الحديثة لتمكين الجيل القادم من القادة.' 
                  : 'Join the premier learning ecosystem where academic rigor meets modern tech to empower the next generation of global leaders.'}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6 pt-6"
              >
                <Link to="/register" className="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
                  {lang === 'ar' ? 'ابدأ رحلتك الآن' : 'Initiate Your Journey'}
                </Link>
                <a href="#courses" className="px-10 py-5 bg-surface-container-low text-on-background border border-outline-variant rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-surface-container-high transition-all">
                  {lang === 'ar' ? 'تصفح الدورات' : 'Explore Courses'}
                </a>
              </motion.div>
            </div>

            {/* Bento Grid Visual (Hero Image) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-5 grid grid-cols-2 gap-6"
            >
              <div className="space-y-6 pt-12">
                <div className="h-64 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant shadow-premium overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Students" />
                </div>
                <div className="h-48 bg-primary-container p-8 rounded-[2.5rem] text-on-primary flex flex-col justify-end">
                   <span className="material-symbols-outlined text-4xl mb-4">military_tech</span>
                   <div className="text-3xl font-black leading-none">+12k</div>
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Global Graduates</div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-secondary p-8 rounded-[2.5rem] text-on-secondary flex flex-col justify-end">
                   <span className="material-symbols-outlined text-4xl mb-4">school</span>
                   <div className="text-3xl font-black leading-none">98%</div>
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Success Rate</div>
                </div>
                <div className="h-64 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant shadow-premium overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Study" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Featured Courses Section ─── */}
      <section id="courses" className="py-32 bg-surface-container-lowest relative">
        <div className="max-w-[1440px] mx-auto px-8">
          <SectionHeading 
            badge={lang === 'ar' ? 'برامجنا المميزة' : 'Elite Programs'}
            title={lang === 'ar' ? 'تعلم من الأفضل' : 'Master the Future'}
            subtitle={lang === 'ar' ? 'اختر من بين مجموعة واسعة من الدورات المصممة لتزويدك بالمهارات الأكثر طلباً في السوق.' : 'Select from our curated portfolio of elite paths engineered for the high-velocity global market.'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-[450px] bg-surface-container-low rounded-[2rem] animate-pulse"></div>
              ))
            ) : courses.slice(0, 6).map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-outline-variant rounded-[2.5rem] overflow-hidden group hover:shadow-premium transition-all"
              >
                <div className="relative h-64 bg-surface-container-low overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 group-hover:opacity-10 transition-opacity" />
                   <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-xl text-[10px] font-black text-primary uppercase tracking-widest border border-outline-variant/30">
                      {lang === 'ar' ? 'دورة مميزة' : 'Elite Path'}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center p-10">
                      <h4 className="text-2xl font-black text-on-surface text-center line-clamp-2">{course.title}</h4>
                   </div>
                </div>
                <div className="p-10 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined">person</span>
                         </div>
                         <div>
                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest leading-none mb-1">Instructor</p>
                            <p className="text-xs font-bold text-on-surface">Dr. Academic Expert</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest leading-none mb-1">Rating</p>
                         <p className="text-xs font-bold text-secondary">★ 4.9</p>
                      </div>
                   </div>
                   
                   <p className="text-on-surface-variant text-sm font-medium leading-relaxed line-clamp-2">
                      {course.description || 'Master advanced concepts and industry-standard workflows in this comprehensive elite program.'}
                   </p>

                   <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
                      <div className="text-2xl font-black text-on-background">$199</div>
                      <Link to={`/login`} className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                         {lang === 'ar' ? 'التسجيل الآن' : 'Enroll Now'}
                         <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-32 bg-background relative overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-8">
            <SectionHeading 
               centered
               badge={lang === 'ar' ? 'لماذا 4A Academy؟' : 'Why Choose Us?'}
               title={lang === 'ar' ? 'مميزات تجعلنا الخيار الأول' : 'Engineered for Excellence'}
               subtitle={lang === 'ar' ? 'نحن نوفر لك كل ما تحتاجه للنجاح في رحلتك التعليمية، من المحتوى المتميز إلى الدعم الفني المستمر.' : 'We provide a comprehensive ecosystem engineered to accelerate your academic and professional trajectory.'}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: 'speed', title_ar: 'تعلم سريع', title_en: 'High Velocity', desc_ar: 'مناهج مكثفة مصممة لسوق العمل.', desc_en: 'Intensive curricula designed for rapid market entry.' },
                 { icon: 'psychology', title_ar: 'ذكاء تعليمي', title_en: 'AI Enhanced', desc_ar: 'توصيات ذكية للمواد الدراسية.', desc_en: 'Smart content recommendations powered by AI.' },
                 { icon: 'workspace_premium', title_ar: 'شهادات معتمدة', title_en: 'Global Credits', desc_ar: 'احصل على شهادة تثبت مهاراتك.', desc_en: 'Earn internationally recognized academic credentials.' },
                 { icon: 'support_agent', title_ar: 'دعم مستمر', title_en: '24/7 Support', desc_ar: 'فريقنا معك في كل خطوة.', desc_en: 'Our elite support team is with you every step of the way.' }
               ].map((feature, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -10 }}
                   className="p-8 bg-surface-container-lowest border border-outline-variant rounded-[2rem] shadow-sm hover:shadow-premium transition-all text-center"
                 >
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                       <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                    </div>
                    <h4 className="text-xl font-black text-on-background mb-4 uppercase tracking-tight">{lang === 'ar' ? feature.title_ar : feature.title_en}</h4>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{lang === 'ar' ? feature.desc_ar : feature.desc_en}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" className="py-32 bg-surface-container-low relative">
         <div className="max-w-[1440px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="relative">
                  <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/50">
                     <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" alt="About" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10"></div>
                  <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
               </div>
               
               <div className="space-y-8">
                  <SectionHeading 
                     badge={lang === 'ar' ? 'من نحن' : 'Our Legacy'}
                     title={lang === 'ar' ? 'أكثر من مجرد أكاديمية' : 'More Than Just an Academy'}
                  />
                  <p className="text-on-surface-variant text-xl font-medium leading-relaxed">
                     {lang === 'ar' 
                       ? 'نحن في 4A Academy نسعى جاهدين لإحداث ثورة في عالم التعليم الرقمي. نجمع بين أحدث التقنيات وأفضل الكوادر الأكاديمية لنقدم لك تجربة تعليمية لا تُنسى.' 
                       : 'At 4A Academy, we are pioneering the revolution of digital education. We synchronize cutting-edge technology with elite academic personnel to deliver an unprecedented learning experience.'}
                  </p>
                  <ul className="space-y-4">
                     {[
                       { icon: 'check_circle', text_ar: 'خبرة تزيد عن 10 سنوات', text_en: '10+ Years of Academic Excellence' },
                       { icon: 'check_circle', text_ar: 'مجتمع يضم أكثر من 50 ألف طالب', text_en: 'Global Community of 50k+ Students' },
                       { icon: 'check_circle', text_ar: 'شراكات مع كبرى الشركات العالمية', text_en: 'Partnerships with Fortune 500 Leaders' }
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-4 text-on-background font-bold">
                          <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                          {lang === 'ar' ? item.text_ar : item.text_en}
                       </li>
                     ))}
                  </ul>
                  <button className="px-10 py-5 bg-on-background text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:brightness-125 transition-all shadow-xl">
                     {lang === 'ar' ? 'اقرأ قصتنا' : 'Read Our Story'}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* ─── Footer Section ─── */}
      <footer className="bg-surface-container-lowest pt-32 pb-16 border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-4 space-y-8">
              <Link className="text-3xl font-black tracking-tighter text-on-background uppercase" to="/">4A Academy</Link>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
                {lang === 'ar' 
                  ? 'نحن نؤمن بأن التعليم هو المفتاح لمستقبل أفضل. مهمتنا هي توفير بيئة تعليمية ملهمة ومبتكرة للجميع.' 
                  : 'We believe that education is the key to a strategic future. Our mission is to provide an inspiring and innovative learning environment for the next generation.'}
              </p>
              <div className="flex gap-4">
                 {['facebook', 'twitter', 'linkedin', 'instagram'].map(icon => (
                   <div key={icon} className="w-12 h-12 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all cursor-pointer group">
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">language</span>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
               {[
                 { title_ar: 'المنصة', title_en: 'Platform', links: [
                   { n: lang === 'ar' ? 'الرئيسية' : 'Home', l: '/' },
                   { n: lang === 'ar' ? 'الدورات' : 'Courses', l: '#courses' },
                   { n: lang === 'ar' ? 'المميزات' : 'Features', l: '/features' },
                   { n: lang === 'ar' ? 'من نحن' : 'About Us', l: '/about' }
                 ]},
                 { title_ar: 'الدعم', title_en: 'Support', links: [
                   { n: lang === 'ar' ? 'مركز المساعدة' : 'Help Center', l: '/support' },
                   { n: lang === 'ar' ? 'تواصل معنا' : 'Contact Us', l: '/support' },
                   { n: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', l: '/legal?tab=privacy' },
                   { n: lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service', l: '/legal?tab=terms' }
                 ]},
                 { title_ar: 'الحساب', title_en: 'Account', links: [
                   { n: lang === 'ar' ? 'تسجيل الدخول' : 'Login', l: '/login' },
                   { n: lang === 'ar' ? 'إنشاء حساب' : 'Register', l: '/register' },
                   { n: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', l: '/login' }
                 ]}
               ].map((group, i) => (
                 <div key={i} className="space-y-8">
                    <h5 className="text-sm font-black uppercase tracking-[0.2em] text-on-background">
                       {lang === 'ar' ? group.title_ar : group.title_en}
                    </h5>
                    <ul className="space-y-4">
                       {group.links.map(link => (
                         <li key={link.n}>
                           {link.l.startsWith('/') ? (
                             <Link to={link.l} className="text-on-surface-variant font-medium hover:text-primary transition-all">{link.n}</Link>
                           ) : (
                             <a href={link.l} className="text-on-surface-variant font-medium hover:text-primary transition-all">{link.n}</a>
                           )}
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="pt-12 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-on-surface-variant text-xs font-black uppercase tracking-widest opacity-60">
              © 2024 4A Academy. All Rights Reserved. Engineered by Elite Teams.
            </p>
            <div className="flex gap-10">
               <Link to="/legal?tab=privacy" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
               <Link to="/legal?tab=terms" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
