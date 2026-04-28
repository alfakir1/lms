import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
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
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { lang, dir, toggle: toggleLang, t } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = dir === 'rtl';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard',  icon: LayoutDashboard, path: `/${user?.role}/dashboard`,  roles: ['admin', 'instructor', 'student', 'reception'] },
    { key: 'users',      icon: Users,            path: '/users',          roles: ['admin'] },
    { key: 'courses',    icon: BookOpen,          path: '/courses',        roles: ['admin', 'instructor', 'student', 'reception'] },
    { key: 'enrollments', icon: Users,            path: '/enrollments',    roles: ['admin', 'instructor', 'reception'] },
    { key: 'students',   icon: Users,             path: '/users',          roles: ['reception'] },
    { key: 'register',   icon: UserPlus,          path: '/register-student', roles: ['admin', 'reception'] },
    { key: 'assignments', icon: FileText,         path: '/assignments',    roles: ['instructor', 'student'] },
    { key: 'grades',      icon: GraduationCap,   path: '/grades',         roles: ['instructor', 'student'] },
    { key: 'attendance',  icon: CheckCircle2,     path: '/attendance',     roles: ['instructor', 'reception'] },
    { key: 'payments',   icon: CreditCard,        path: '/payments',       roles: ['admin', 'reception', 'student'] },
    { key: 'certificates', icon: Award,           path: '/certificates',   roles: ['admin', 'instructor', 'reception'] },
  ].filter(item => item.roles.includes(user?.role ?? ''))
   .filter((item, idx, arr) => arr.findIndex(a => a.path === item.path) === idx);



  return (
    <div className="min-h-screen flex bg-background" dir={dir}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!sidebarOpen && (
           <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(true)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 0,
          x: sidebarOpen ? 0 : (isRtl ? 280 : -280)
        }}
        className={`fixed inset-y-0 z-50 bg-card border-border shadow-2xl lg:shadow-none lg:static overflow-hidden flex flex-col print-hide ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}`}
      >
        <div className="h-full flex flex-col w-[280px]">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap className="text-primary-foreground w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground leading-tight tracking-tight">4A ACADEMY</h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t('academy_tagline') || 'Integrated Academy'}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path) && item.path.length > 1);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary-foreground' : 'group-hover:text-primary transition-colors'}`} />
                  <span className="font-bold text-sm">{t(item.key)}</span>
                  {active && (
                    <motion.div 
                      layoutId="active-pill"
                      className={`absolute inset-y-2 w-1 bg-primary-foreground rounded-full ${isRtl ? 'left-2' : 'right-2'}`} 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-3 py-3 bg-muted/50 rounded-2xl border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-black border border-primary/20">
                {user?.name?.[0] ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-40 print-hide">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all border border-border"
              aria-label="toggle sidebar"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="relative hidden xl:block">
              <Search className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <input
                type="text"
                placeholder={t('search')}
                className="w-80 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all border border-border text-foreground group"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              ) : (
                <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all border border-border text-sm font-bold text-foreground"
              title="Switch language"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Notifications */}
            <button className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl relative transition-all border border-border text-foreground group">
              <Bell className="w-5 h-5 group-hover:shake transition-transform" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card animate-pulse" />
            </button>

            <div className="h-10 w-px bg-border mx-1 hidden sm:block" />

            {/* User Avatar */}
            <Link to="/profile" className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-foreground leading-none">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-tighter">{user?.role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform border-2 border-card">
                {user?.name?.[0] ?? 'U'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
             <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
