import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { GraduationCap, User, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { t } = useTranslation();

  return (
    <header className="glass sticky top-0 z-50 border-b border-neutral-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:shadow-primary/40 transition-all duration-300">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary bg-clip-text text-transparent transform transition-all group-hover:scale-[1.02]">
                Four Academy
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-text hover:text-primary font-medium transition-all duration-300 hover:-translate-y-0.5 dark:text-text-h dark:hover:text-primary">
                {t('nav.home')}
              </Link>
              <Link to="/courses" className="text-text hover:text-primary font-medium transition-all duration-300 hover:-translate-y-0.5 dark:text-text-h dark:hover:text-primary">
                {t('nav.courses')}
              </Link>
              <a href="#about" className="text-text hover:text-primary font-medium transition-all duration-300 hover:-translate-y-0.5 dark:text-text-h dark:hover:text-primary">
                {t('nav.about')}
              </a>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user?.role === 'super_admin' ? '/admin/dashboard' : `/${user?.role}/dashboard`}
                    className="hidden sm:flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                  >
                    {t('nav.dashboard', 'Dashboard')}
                  </Link>
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm shadow-soft dark:border-slate-700 dark:bg-slate-900">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-neutral-700 font-medium dark:text-neutral-300">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-text hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-text-h dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.logout', 'Logout')}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-text hover:text-primary font-medium transition-colors dark:text-text-h dark:hover:text-primary"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-white text-sm px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;