import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <button
      onClick={() => changeLanguage(isArabic ? 'en' : 'ar')}
      aria-label="Switch language"
      title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      className="
        relative inline-flex items-center gap-2
        rounded-xl border border-neutral-200 dark:border-slate-700
        bg-white/95 dark:bg-slate-800/95
        backdrop-blur-sm px-3 py-2
        text-sm font-bold
        text-neutral-700 dark:text-neutral-300
        shadow-soft hover:shadow-md
        hover:border-primary-400 dark:hover:border-primary-500
        transition-all duration-200
        select-none
      "
    >
      {/* Globe icon */}
      <svg
        className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      {/* Pill toggle */}
      <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-slate-700 p-0.5 gap-0.5">
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-black transition-all duration-200 ${
            !isArabic
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600'
          }`}
        >
          EN
        </span>
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-black transition-all duration-200 ${
            isArabic
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600'
          }`}
        >
          AR
        </span>
      </div>
    </button>
  );
};

export default LanguageSwitcher;
