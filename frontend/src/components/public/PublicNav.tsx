import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { path: '/',         label_ar: 'الرئيسية', label_en: 'Home' },
  { path: '/courses',  label_ar: 'الدورات',   label_en: 'Courses' },
  { path: '/features', label_ar: 'المميزات', label_en: 'Features' },
  { path: '/about',    label_ar: 'من نحن',   label_en: 'About' },
  { path: '/support',  label_ar: 'الدعم',    label_en: 'Support' },
];

const PublicNav: React.FC = () => {
  const { lang, dir, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav
        className={`fixed right-0 left-0 top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-surface/95 backdrop-blur-2xl shadow-premium border-b border-outline-variant/40'
            : 'bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-8 h-24" dir={dir}>

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-on-background uppercase hidden sm:block">
              4A Academy
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2.5 rounded-xl font-black text-sm tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                      : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container-low'
                  }`}
                >
                  {lang === 'ar' ? link.label_ar : link.label_en}
                </Link>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            {/* Theme & Lang */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-on-surface-variant hover:text-primary bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all"
                title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                <span className="material-symbols-outlined text-xl">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
              </button>
              <button
                onClick={toggleLang}
                className="p-2.5 text-on-surface-variant hover:text-primary bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all"
                title="Switch Language"
              >
                <span className="material-symbols-outlined text-xl">translate</span>
              </button>
            </div>

            <div className="h-8 w-px bg-outline-variant/40 hidden sm:block" />

            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary font-black text-sm uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              <span className="hidden sm:inline">{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 text-on-surface-variant bg-surface-container-low rounded-xl"
            >
              <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-outline-variant/30 bg-surface-container-lowest px-6 py-6 space-y-2" dir={dir}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-base transition-all ${
                    active
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'
                  }`}
                >
                  {lang === 'ar' ? link.label_ar : link.label_en}
                </Link>
              );
            })}
            <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
              <button onClick={toggleTheme} className="flex-1 p-3 bg-surface-container-low rounded-xl text-on-surface-variant flex items-center justify-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-xl">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
              </button>
              <button onClick={toggleLang} className="flex-1 p-3 bg-surface-container-low rounded-xl text-on-surface-variant flex items-center justify-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-xl">translate</span>
                <span>{lang === 'ar' ? 'EN' : 'AR'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default PublicNav;
