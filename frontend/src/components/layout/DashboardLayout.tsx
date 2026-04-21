import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import {
  LayoutDashboard, BookOpen, Users, CreditCard, BarChart2,
  GraduationCap, FileText, Award, ClipboardList, UserCheck,
  Calendar, FileSpreadsheet, LogOut, Menu, X, ChevronRight,
  Settings, TrendingUp, Bell
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<string, NavItem[]> = {
  student: [
    { label: 'Dashboard',    path: '/student/dashboard',    icon: LayoutDashboard },
    { label: 'My Courses',   path: '/student/courses',      icon: BookOpen },
    { label: 'Assignments',  path: '/student/assignments',  icon: FileText },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
  ],
  instructor: [
    { label: 'Dashboard',    path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses',   path: '/instructor/courses',   icon: BookOpen },
    { label: 'Assignments',  path: '/instructor/assignments', icon: ClipboardList },
    { label: 'My Students',  path: '/instructor/students',  icon: Users },
    { label: 'Attendance',   path: '/instructor/attendance', icon: Calendar },
    { label: 'Grades Sheet', path: '/instructor/grades',    icon: FileSpreadsheet },
    { label: 'Analytics',    path: '/instructor/analytics', icon: TrendingUp },
  ],
  reception: [
    { label: 'Dashboard',       path: '/reception/dashboard', icon: LayoutDashboard },
    { label: 'Register Student',path: '/reception/register',  icon: UserCheck },
    { label: 'Students',        path: '/reception/students',  icon: Users },
    { label: 'Courses',         path: '/reception/courses',   icon: BookOpen },
    { label: 'Payments',        path: '/reception/payments',  icon: CreditCard },
  ],
  admin: [
    { label: 'Dashboard',   path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users',       path: '/admin/users',     icon: Users },
    { label: 'Courses',     path: '/admin/courses',   icon: BookOpen },
    { label: 'Payments',    path: '/admin/payments',  icon: CreditCard },
    { label: 'Reports',     path: '/admin/reports',   icon: BarChart2 },
  ],
  super_admin: [
    { label: 'Dashboard',   path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users',       path: '/admin/users',     icon: Users },
    { label: 'Courses',     path: '/admin/courses',   icon: BookOpen },
    { label: 'Payments',    path: '/admin/payments',  icon: CreditCard },
    { label: 'Reports',     path: '/admin/reports',   icon: BarChart2 },
  ],
};

const roleColors: Record<string, string> = {
  student:    'from-blue-600 to-indigo-600',
  instructor: 'from-emerald-600 to-teal-600',
  reception:  'from-violet-600 to-purple-600',
  admin:      'from-rose-600 to-pink-600',
  super_admin:'from-amber-500 to-orange-600',
};

const roleLabels: Record<string, string> = {
  student:    'Student Portal',
  instructor: 'Instructor Portal',
  reception:  'Reception Portal',
  admin:      'Admin Portal',
  super_admin:'Super Admin',
};

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'student';
  const navItems = navByRole[role] || navByRole.student;
  const gradient = roleColors[role] || roleColors.student;
  const portalLabel = roleLabels[role] || 'Portal';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-xl">
            4
          </div>
          <div>
            <div className="font-black text-sm tracking-wider uppercase">Four Academy</div>
            <div className="text-[10px] opacity-75 uppercase tracking-widest">{portalLabel}</div>
          </div>
        </div>
        {/* User card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{user?.name}</p>
            <p className="text-[10px] opacity-70 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm
                transition-all duration-200 group
                ${isActive
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-neutral-900 dark:hover:text-white'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-white'} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-neutral-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 px-4 py-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={18} />
          {t('auth.logout', 'Logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-neutral-100 dark:border-slate-800 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl
        transform transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-800"
        >
          <X size={20} className="text-neutral-500" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-neutral-100 dark:border-slate-800 shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={22} className="text-neutral-700 dark:text-white" />
          </button>
          <div className="flex items-center gap-2 font-black text-neutral-900 dark:text-white">
            <div className={`w-7 h-7 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-sm font-black`}>
              4
            </div>
            Four Academy
          </div>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-neutral-500" />
          </div>
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
