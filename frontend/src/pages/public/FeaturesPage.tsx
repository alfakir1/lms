import React from 'react';
import PublicNav from '../../components/public/PublicNav';
import PublicFooter from '../../components/public/PublicFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../../context/LangContext';

const FeaturesPage: React.FC = () => {
  const { lang, dir } = useLang();

  const features = [
    {
      icon: 'school',
      color: 'primary',
      title_ar: 'دورات أكاديمية معتمدة',
      title_en: 'Accredited Academic Courses',
      desc_ar: 'مكتبة ضخمة من الدورات التعليمية المعتمدة دولياً، مصممة بعناية فائقة من قِبل خبراء في مجالاتهم.',
      desc_en: 'A vast library of internationally accredited courses, meticulously crafted by industry-leading subject matter experts.',
    },
    {
      icon: 'psychology',
      color: 'secondary',
      title_ar: 'توصيات مدعومة بالذكاء الاصطناعي',
      title_en: 'AI-Powered Recommendations',
      desc_ar: 'يتعلم النظام من نمط دراستك ويقترح المحتوى المناسب لتسريع تقدمك الأكاديمي.',
      desc_en: 'Our system learns your study patterns and surfaces precisely the right content to accelerate your academic velocity.',
    },
    {
      icon: 'workspace_premium',
      color: 'tertiary',
      title_ar: 'شهادات معترف بها عالمياً',
      title_en: 'Globally Recognized Credentials',
      desc_ar: 'احصل على شهادات رقمية محمية، معترف بها من قِبل كبرى الشركات والمؤسسات حول العالم.',
      desc_en: 'Earn protected digital credentials recognized by Fortune 500 companies and leading institutions worldwide.',
    },
    {
      icon: 'live_tv',
      color: 'primary',
      title_ar: 'بث مباشر تفاعلي',
      title_en: 'Interactive Live Streaming',
      desc_ar: 'تواصل مع محاضريك مباشرة عبر جلسات بث حية تتيح لك المشاركة والطرح والنقاش في الوقت الفعلي.',
      desc_en: 'Connect with your instructors in real-time via high-fidelity live sessions with Q&A, polls, and collaborative whiteboards.',
    },
    {
      icon: 'assignment_turned_in',
      color: 'secondary',
      title_ar: 'تقييمات ذكية آنية',
      title_en: 'Intelligent Real-Time Assessment',
      desc_ar: 'نظام تقييم متكامل يشمل الاختبارات والتكليفات والمشاريع مع تغذية راجعة فورية.',
      desc_en: 'A comprehensive evaluation engine covering quizzes, assignments, and capstone projects with instant feedback loops.',
    },
    {
      icon: 'groups',
      color: 'tertiary',
      title_ar: 'مجتمع تعليمي نشط',
      title_en: 'Thriving Learning Community',
      desc_ar: 'انضم إلى مجتمع يضم أكثر من 50,000 طالب ومحاضر من شتى أرجاء العالم.',
      desc_en: 'Join a vibrant ecosystem of 50,000+ students and instructors from every corner of the globe.',
    },
    {
      icon: 'devices',
      color: 'primary',
      title_ar: 'متعدد المنصات',
      title_en: 'True Cross-Platform',
      desc_ar: 'تجربة سلسة على الويب والجوال والتابلت مع إمكانية التعلم بدون إنترنت.',
      desc_en: 'A seamless, pixel-perfect experience across web, mobile, and tablet, with offline learning capabilities.',
    },
    {
      icon: 'support_agent',
      color: 'secondary',
      title_ar: 'دعم فني على مدار الساعة',
      title_en: '24/7 Elite Support',
      desc_ar: 'فريق دعم متخصص يعمل على مدار الساعة لضمان تجربة تعليمية خالية من أي عوائق.',
      desc_en: 'A dedicated support squad operating around the clock to ensure a frictionless learning journey for every student.',
    },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
  };

  return (
    <div className="min-h-screen bg-background text-on-background" dir={dir}>
      <PublicNav />

      {/* Hero */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/3 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.25em] rounded-full border border-primary/20 mb-8"
          >
            {lang === 'ar' ? 'ما يميزنا' : 'Platform Capabilities'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter text-on-background leading-[1.05] mb-8"
          >
            {lang === 'ar' ? <>مميزات<br /><span className="text-primary-container">لا مثيل لها</span></> : <>Features<br /><span className="text-primary-container">Built to Win</span></>}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {lang === 'ar'
              ? 'كل ما تحتاجه للنجاح في رحلتك التعليمية، موجود في مكان واحد وبتجربة لا تُضاهى.'
              : 'Everything you need to dominate your learning journey, architected in one seamless, premium experience.'}
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-8 bg-surface-container-lowest border border-outline-variant rounded-[2rem] shadow-sm hover:shadow-premium hover:border-primary/20 transition-all group"
              >
                <div className={`w-14 h-14 ${colorMap[f.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-lg font-black text-on-background mb-3 leading-tight">
                  {lang === 'ar' ? f.title_ar : f.title_en}
                </h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                  {lang === 'ar' ? f.desc_ar : f.desc_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <h2 className="text-5xl font-black text-on-background tracking-tighter mb-6">
            {lang === 'ar' ? 'هل أنت مستعد للانطلاق؟' : 'Ready to Launch?'}
          </h2>
          <p className="text-on-surface-variant text-xl font-medium mb-10">
            {lang === 'ar' ? 'انضم إلى آلاف الطلاب الذين يبنون مستقبلهم مع 4A Academy.' : 'Join thousands of students already engineering their future with 4A Academy.'}
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/register" className="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
              {lang === 'ar' ? 'ابدأ مجاناً' : 'Start For Free'}
            </Link>
            <Link to="/support" className="px-10 py-5 bg-surface-container-low text-on-background border border-outline-variant rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-surface-container-high transition-all">
              {lang === 'ar' ? 'تحدث معنا' : 'Talk to Us'}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default FeaturesPage;

