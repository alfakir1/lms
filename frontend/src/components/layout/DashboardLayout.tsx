import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  GraduationCap,
  Moon,
  Sun,
  Globe,
  Users,
  Video
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<string, NavItem[]> = {
  student: [
    { label: 'nav.dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'student.myCourses', path: '/student/courses', icon: BookOpen },
    { label: 'admin.payments', path: '/student/payments', icon: CreditCard },
  ],
  instructor: [
    { label: 'nav.dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'instructor.manageCourses', path: '/instructor/courses', icon: BookOpen },
    { label: 'Manage Lectures', path: '/instructor/lectures', icon: Video },
  ],
  admin: [
    { label: 'nav.dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'admin.manageUsers', path: '/admin/users', icon: Users },
    { label: 'admin.payments', path: '/admin/payments', icon: CreditCard },
  ],
  super_admin: [
    { label: 'nav.dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'admin.manageUsers', path: '/admin/users', icon: Users },
    { label: 'admin.payments', path: '/admin/payments', icon: CreditCard },
  ],
};

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'student';
  const navItems = navByRole[role] || navByRole.student;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 dark:bg-slate-950 border-r border-transparent dark:border-slate-800">
      {/* Brand */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 text-white mb-8">
          <div className="bg-primary-600 p-2 rounded-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Four Academy</span>
        </Link>
        
        {/* User Info */}
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <div className="w-10 h-10 bg-primary-600/20 text-primary-400 rounded-lg flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-400 truncate capitalize">{role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-600 text-white shadow-glow-primary'
                  : 'hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {t(item.label)}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-10 ltr:left-0 rtl:right-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-72 transform transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}
      `}>
        <div className="absolute top-4 right-4 z-50 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ltr:lg:pl-64 rtl:lg:pr-64 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mx-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-bold text-slate-900 dark:text-white">Four Academy</div>
          <div className="flex items-center gap-1">
            <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 text-slate-600 dark:text-slate-400">
              <Globe className="h-5 w-5" />
            </button>
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 gap-3 transition-colors">
          <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            <Globe className="h-5 w-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
