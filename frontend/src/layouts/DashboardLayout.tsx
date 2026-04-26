import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserPlus,
  LogOut,
  Menu,
  Bell,
  Search,
  FileText,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  Globe,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { lang, dir, toggle, t } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = dir === 'rtl';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    // ── Visible to everyone (dashboard is role-specific) ──
    { key: 'dashboard',  icon: LayoutDashboard, path: `/${user?.role}/dashboard`,  roles: ['admin', 'instructor', 'student', 'reception'] },

    // ── Admin only ──
    { key: 'users',      icon: Users,            path: '/users',          roles: ['admin'] },

    // ── Courses: all roles (read), admin+instructor manage ──
    { key: 'courses',    icon: BookOpen,          path: '/courses',        roles: ['admin', 'instructor', 'student', 'reception'] },

    // ── Reception: student management + registration + payments ──
    { key: 'students',   icon: Users,             path: '/users',          roles: ['reception'] },
    { key: 'register',   icon: UserPlus,          path: '/register-student', roles: ['admin', 'reception'] },

    // ── Instructor: assignments, grades, attendance ──
    { key: 'assignments', icon: FileText,         path: '/assignments',    roles: ['instructor', 'student'] },
    { key: 'grades',      icon: GraduationCap,   path: '/grades',         roles: ['instructor', 'student'] },
    { key: 'attendance',  icon: CheckCircle2,     path: '/attendance',     roles: ['instructor', 'reception'] },

    // ── Payments: admin + reception + student (own only) ──
    { key: 'payments',   icon: CreditCard,        path: '/payments',       roles: ['admin', 'reception', 'student'] },
    // ── Certificates: admin + reception (print/view), instructor (view) ──
    { key: 'certificates', icon: Award,           path: '/certificates',   roles: ['admin', 'instructor', 'reception'] },
  ].filter(item => item.roles.includes(user?.role ?? ''))
   // De-duplicate paths (e.g. /users appears for admin AND reception separately)
   .filter((item, idx, arr) => arr.findIndex(a => a.path === item.path) === idx);

  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen flex bg-slate-50" dir={dir}>
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 272, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 z-50 bg-white border-e border-slate-200 shadow-xl lg:static overflow-hidden"
          >
            <div className="h-full flex flex-col w-68">
              {/* Logo */}
              <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900 leading-tight">فور أيه</h1>
                  <p className="text-[10px] text-slate-400 font-medium">أكاديمية متكاملة</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const active = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path) && item.path.length > 1);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        active
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                      <span className="font-semibold text-sm">{t(item.key)}</span>
                      {active && <Chevron className="w-4 h-4 ms-auto opacity-60" />}
                    </Link>
                  );
                })}
              </nav>

              {/* User + Logout */}
              <div className="p-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.name?.[0] ?? 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="toggle sidebar"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('search')}
                className="pe-9 ps-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 w-72 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-slate-100 rounded-xl relative transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {user?.name?.[0] ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-6 overflow-x-hidden flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
