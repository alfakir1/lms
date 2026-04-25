import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, User, X, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const dashboardPath = user?.role === 'super_admin' ? '/admin/dashboard' : `/${user?.role}/dashboard`;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-glow-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Four Academy</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.home')}
            </Link>
            <Link to="/courses" className="text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.courses')}
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Globe className="h-5 w-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to={dashboardPath}>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t('nav.register')}</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600">
            <Globe className="h-5 w-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:hidden p-4">
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              {t('nav.home')}
            </Link>
            <Link to="/courses" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              {t('nav.courses')}
            </Link>
            <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20">
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await handleLogout();
                  }}
                  className="rounded-lg px-4 py-2 font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {t('nav.login')}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 font-medium text-white bg-primary-600 text-center">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
