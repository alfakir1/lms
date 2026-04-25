import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="font-bold text-slate-900 dark:text-white text-xl">
              {t('footer.title')}
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t('footer.description')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.home')}
            </Link>
            <Link to="/courses" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.courses')}
            </Link>
            <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.register')}
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
