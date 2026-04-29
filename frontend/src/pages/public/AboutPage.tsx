import React from 'react';
import PublicNav from '../../components/public/PublicNav';
import PublicFooter from '../../components/public/PublicFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

const stats = [
  { icon: 'school', val: '+12,000', label_ar: 'خريج عالمي', label_en: 'Global Graduates' },
  { icon: 'star', val: '4.9★', label_ar: 'تقييم المنصة', label_en: 'Platform Rating' },
  { icon: 'groups', val: '50k+', label_ar: 'مجتمع نشط', label_en: 'Active Community' },
  { icon: 'workspace_premium', val: '98%', label_ar: 'معدل النجاح', label_en: 'Success Rate' },
];

const team = [
  { name_ar: 'د. محمد الأحمدي', name_en: 'Dr. Mohammed Al-Ahmadi', role_ar: 'مؤسس ومدير أكاديمي', role_en: 'Founder & Academic Director', icon: 'person' },
  { name_ar: 'م. سارة الزهراني', name_en: 'Eng. Sara Al-Zahrani', role_ar: 'مديرة التكنولوجيا', role_en: 'Chief Technology Officer', icon: 'person' },
  { name_ar: 'أ. خالد الشمري', name_en: 'Prof. Khalid Al-Shamri', role_ar: 'رئيس المحتوى التعليمي', role_en: 'Head of Curriculum Design', icon: 'person' },
  { name_ar: 'د. ريم الحربي', name_en: 'Dr. Reem Al-Harbi', role_ar: 'مستشارة تعليمية أولى', role_en: 'Senior Learning Advisor', icon: 'person' },
];

const AboutPage: React.FC = () => {
  const { lang, dir } = useLang();

  return (
    <div className="min-h-screen bg-background text-on-background" dir={dir}>
      <PublicNav />

      {/* Hero */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 bg-secondary/10 text-secondary font-black text-[10px] uppercase tracking-[0.25em] rounded-full border border-secondary/20 mb-8"
          >
            {lang === 'ar' ? 'قصتنا' : 'Our Legacy'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter text-on-background leading-[1.05] mb-8"
          >
            {lang === 'ar' ? <>أكثر من<br /><span className="text-primary-container">مجرد أكاديمية</span></> : <>More Than<br /><span className="text-primary-container">Just an Academy</span></>}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {lang === 'ar'
              ? 'منذ عام 2014، ونحن نُحدث ثورة في عالم التعليم الرقمي العربي، بأدوات حديثة وكوادر أكاديمية متميزة.'
              : 'Since 2014, we have been engineering a revolution in digital education, combining modern tooling with elite academic talent.'}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
              </div>
              <div className="text-4xl font-black text-on-background tracking-tighter mb-1">{s.val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                {lang === 'ar' ? s.label_ar : s.label_en}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900"
              alt="Team"
              className="rounded-[3rem] w-full object-cover shadow-2xl border-8 border-surface-container-lowest"
            />
          </div>
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-full border border-primary/20">
              {lang === 'ar' ? 'مهمتنا' : 'Our Mission'}
            </span>
            <h2 className="text-5xl font-black text-on-background tracking-tighter leading-tight">
              {lang === 'ar' ? 'تمكين كل طالب من الوصول إلى الامتياز' : 'Empowering Every Student to Reach Excellence'}
            </h2>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
              {lang === 'ar'
                ? 'في 4A Academy نؤمن بأن جودة التعليم لا يجب أن تكون حكراً على فئة معينة. نسعى لديمقراطية التعلم من خلال تقنيات متطورة ومحتوى أكاديمي رفيع المستوى.'
                : 'At 4A Academy we believe that quality education should not be a privilege. We democratize learning through cutting-edge technology and elite academic content.'}
            </p>
            <ul className="space-y-4">
              {[
                { ar: 'خبرة تزيد عن 10 سنوات في التعليم الرقمي', en: '10+ years of pioneering digital education' },
                { ar: 'أكثر من 200 دورة معتمدة في شتى التخصصات', en: '200+ accredited courses across all disciplines' },
                { ar: 'شراكات استراتيجية مع مؤسسات عالمية كبرى', en: 'Strategic alliances with global Fortune 500 institutions' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-on-background font-bold">
                  <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                  {lang === 'ar' ? item.ar : item.en}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-full border border-primary/20 mb-6">
              {lang === 'ar' ? 'فريقنا' : 'The Team'}
            </span>
            <h2 className="text-5xl font-black text-on-background tracking-tighter">
              {lang === 'ar' ? 'العقول المحركة للأكاديمية' : 'The Minds Behind the Academy'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 text-center group hover:shadow-premium transition-all"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">person</span>
                </div>
                <h4 className="text-lg font-black text-on-background mb-2">
                  {lang === 'ar' ? member.name_ar : member.name_en}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  {lang === 'ar' ? member.role_ar : member.role_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <h2 className="text-5xl font-black text-on-background tracking-tighter mb-6">
            {lang === 'ar' ? 'كن جزءاً من القصة' : 'Become Part of the Story'}
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/register" className="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
              {lang === 'ar' ? 'انضم الآن' : 'Join Now'}
            </Link>
            <Link to="/support" className="px-10 py-5 bg-surface-container-low text-on-background border border-outline-variant rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-surface-container-high transition-all">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;

