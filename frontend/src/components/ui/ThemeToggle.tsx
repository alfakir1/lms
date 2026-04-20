import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-medium text-neutral-700 shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 dark:border-slate-700 dark:bg-slate-800/95 dark:text-neutral-300 dark:hover:bg-slate-700"
      aria-label={t('theme.toggle')}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-blue-500" />
      )}
      <span className="text-neutral-600 dark:text-neutral-400">
        {theme === 'dark' ? t('theme.light') : t('theme.dark')}
      </span>
    </button>
  );
};

export default ThemeToggle;
