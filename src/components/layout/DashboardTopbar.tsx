import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const DashboardTopbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-white md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-text dark:text-white">{t('dashboard.topbar.title')}</h2>
        <p className="text-sm text-gray-600 dark:text-slate-400">{t('dashboard.topbar.subtitle')}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default DashboardTopbar;
