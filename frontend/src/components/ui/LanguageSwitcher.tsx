import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-medium text-neutral-700 shadow-soft hover:shadow-medium transition-all duration-200 dark:border-slate-700 dark:bg-slate-800/95 dark:text-neutral-300">
      <span className="text-neutral-600 dark:text-neutral-400">{t('language.label')}:</span>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as 'en' | 'ar')}
        className="bg-transparent outline-none text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label={t('language.switch')}
      >
        <option value="en">EN</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
