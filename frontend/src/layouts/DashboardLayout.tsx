import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
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
    { key: 'dashboard',  icon: 'dashboard', path: `/${user?.role}/dashboard`,  roles: ['admin', 'instructor', 'student', 'reception'] },
    { key: 'users',      icon: 'group',            path: '/users',          roles: ['admin'] },
    { key: 'courses',    icon: 'school',          path: '/courses',        roles: ['admin', 'instructor', 'student', 'reception'] },
    { key: 'enrollments', icon: 'person_add',            path: '/enrollments',    roles: ['admin', 'instructor', 'reception'] },
    { key: 'students',   icon: 'group',             path: '/users',          roles: ['reception'] },
    { key: 'register',   icon: 'person_add',          path: '/register-student', roles: ['admin', 'reception'] },
    { key: 'assignments', icon: 'assignment',         path: '/assignments',    roles: ['instructor', 'student'] },
    { key: 'grades',      icon: 'grade',   path: '/grades',         roles: ['instructor', 'student'] },
    { key: 'attendance',  icon: 'check_circle',     path: '/attendance',     roles: ['instructor', 'reception'] },
    { key: 'payments',   icon: 'payments',        path: '/payments',       roles: ['admin', 'reception', 'student'] },
    { key: 'certificates', icon: 'workspace_premium',           path: '/certificates',   roles: ['admin', 'instructor', 'reception'] },
  ].filter(item => item.roles.includes(user?.role ?? ''))
   .filter((item, idx, arr) => arr.findIndex(a => a.path === item.path) === idx);

  return (
    <div className={`min-h-screen flex bg-background text-on-background selection:bg-primary/20`} dir={dir}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!sidebarOpen && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
            onClick={() => setSidebarOpen(true)} 
           />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 0,
          x: sidebarOpen ? 0 : (isRtl ? 280 : -280)
        }}
        className={`fixed inset-y-0 z-50 bg-surface-container-lowest border-outline-variant shadow-2xl lg:shadow-none lg:static overflow-hidden flex flex-col print-hide ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}`}
      >
        <div className="h-full flex flex-col w-[280px]">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-11 h-11 bg-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary-container/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-on-background tracking-tighter leading-none uppercase">4A Academy</h1>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Elite Portal</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-3 bg-surface-container-low rounded-xl text-on-surface-variant">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path) && item.path.length > 1);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                    active
                      ? 'bg-primary-container/5 text-primary-container font-black border-l-4 border-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${active ? 'fill-icon' : 'group-hover:scale-110 transition-transform'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold tracking-tight">{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="px-4 pb-8 mt-auto pt-6 border-t border-outline-variant">
             <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black shadow-lg shadow-primary/20 overflow-hidden flex-shrink-0">
                   {user?.name?.[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-on-background truncate">{user?.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60 truncate">{user?.role}</p>
                </div>
              </div>
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center gap-3 py-3.5 text-error font-black text-[11px] uppercase tracking-widest hover:bg-error/5 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              {t('logout')}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/50 px-8 flex items-center justify-between sticky top-0 z-40 print-hide">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 text-on-surface-variant hover:text-primary rounded-xl transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            
            <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/30 group focus-within:border-primary/50 transition-all w-[400px]">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
              <input
                type="text"
                placeholder={t('search')}
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-background px-4 placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 text-on-surface-variant hover:text-primary rounded-xl transition-all">
              <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
            </button>
            <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary rounded-xl transition-all text-xs font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-lg">language</span>
              <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/50 mx-2" />
            <Link to="/profile" className="flex items-center gap-3 group">
               <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                  {user?.name?.[0] || 'U'}
               </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[1600px] mx-auto min-h-full">
             <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
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
