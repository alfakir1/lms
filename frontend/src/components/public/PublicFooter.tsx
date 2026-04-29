import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LangContext';

const footerLinks = [
  { path: '/',                   label_ar: 'الرئيسية', label_en: 'Home'    },
  { path: '/courses',            label_ar: 'الدورات',   label_en: 'Courses' },
  { path: '/features',           label_ar: 'المميزات', label_en: 'Features' },
  { path: '/about',              label_ar: 'من نحن',   label_en: 'About'   },
  { path: '/support',            label_ar: 'الدعم',    label_en: 'Support' },
  { path: '/legal?tab=privacy',  label_ar: 'الخصوصية', label_en: 'Privacy' },
  { path: '/legal?tab=terms',    label_ar: 'الشروط',   label_en: 'Terms'   },
];

const PublicFooter: React.FC = () => {
  const { lang, dir } = useLang();
  return (
    <footer className="bg-surface-container border-t border-outline-variant/30 py-10" dir={dir}>
      <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="text-2xl font-black tracking-tighter text-on-background uppercase flex-shrink-0">
          4A Academy
        </Link>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all"
            >
              {lang === 'ar' ? l.label_ar : l.label_en}
            </Link>
          ))}
        </div>
        <p className="text-[10px] text-on-surface-variant/50 font-black uppercase tracking-widest flex-shrink-0">
          © 2024 4A Academy
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;
