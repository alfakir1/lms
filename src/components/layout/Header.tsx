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
    <header className="bg-background/95 backdrop-blur-sm shadow-soft border-b border-neutral-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between rtl:md:flex-row-reverse">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6 rtl:md:flex-row-reverse">
            <Link to="/" className="flex items-center gap-3 group rtl:flex-row-reverse">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow group-hover:shadow-glow transition-all duration-200">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Four Academy
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 rtl:flex-row-reverse">
              <Link to="/" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 dark:text-neutral-300 dark:hover:text-primary-400">
                {t('nav.home')}
              </Link>
              <Link to="/courses" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 dark:text-neutral-300 dark:hover:text-primary-400">
                {t('nav.courses')}
              </Link>
              <a href="#about" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 dark:text-neutral-300 dark:hover:text-primary-400">
                {t('nav.about')}
              </a>
              {isAuthenticated && (
                <Link 
                  to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'instructor' ? '/instructor/dashboard' : user?.role === 'reception' ? '/reception/dashboard' : '/student/dashboard'} 
                  className="text-primary-600 font-bold transition-all duration-200 hover:scale-105 dark:text-primary-400"
                >
                  {t('nav.dashboard')}
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3 rtl:flex-row-reverse">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm shadow-soft dark:border-slate-700 dark:bg-slate-900 rtl:flex-row-reverse">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col rtl:text-right">
                      <span className="text-neutral-700 font-bold dark:text-neutral-300 truncate max-w-[120px]">
                        {user?.name || t('common.user')}
                      </span>
                      {user?.role === 'student' && user.student_id && (
                        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-black tracking-widest uppercase">
                          {t('student.id')}: {user.student_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all duration-200 shadow-soft hover:shadow-medium dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-300 dark:hover:bg-slate-700 rtl:flex-row-reverse"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 rtl:flex-row-reverse">
                  <Link
                    to="/login"
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors dark:text-neutral-300 dark:hover:text-primary-400"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm px-4 py-2 rounded-xl font-medium shadow-soft hover:shadow-medium transform hover:scale-105 transition-all duration-200"
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