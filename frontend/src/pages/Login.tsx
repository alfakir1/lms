import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { lang, dir, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || `/${user.role}/dashboard`;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(loginId, password);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        (lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary/30 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700" dir={dir}>
      
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[140px]" 
        />
      </div>

      {/* Language & Theme Toggles */}
      <div className="fixed top-8 right-8 z-50 flex gap-3">
        <button 
          onClick={toggleTheme}
          className="bg-surface-container-low backdrop-blur-xl border border-outline-variant/30 w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all shadow-xl group"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:rotate-12 transition-transform">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>
        <button 
          onClick={toggleLang}
          className="bg-surface-container-low backdrop-blur-xl border border-outline-variant/30 px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-surface-container-high transition-all text-[11px] font-black uppercase tracking-widest text-on-surface-variant shadow-xl group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">language</span>
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[500px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant p-10 md:p-14 rounded-[3rem] shadow-premium relative overflow-hidden"
        >
          {/* Inner shimmer highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent pointer-events-none" />

          {/* Brand & Header */}
          <header className="text-center mb-12 relative">
            <Link to="/" className="inline-block mb-8 group">
              <span className="text-4xl lg:text-5xl font-black tracking-tighter text-on-background group-hover:text-primary transition-all uppercase">
                4A Academy
              </span>
            </Link>
            <h1 className="text-3xl font-black text-on-background mb-3 tracking-tight">
              {lang === 'ar' ? 'مرحباً بك مجدداً' : 'Welcome Back'}
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              {lang === 'ar' ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Enter your credentials to access your dashboard'}
            </p>
          </header>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            {/* User ID Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1" htmlFor="id">
                {lang === 'ar' ? 'البريد الإلكتروني / رقم الطالب' : 'Email / Student ID'}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                <input 
                  id="id"
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-5 pl-14 pr-6 text-on-background placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder={lang === 'ar' ? 'أدخل معرف الدخول' : 'Enter login ID'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1" htmlFor="password">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-5 pl-14 pr-14 text-on-background placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Helpers */}
            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                <span className="text-on-surface-variant font-bold group-hover:text-on-background transition-colors">
                  {lang === 'ar' ? 'تذكرني' : 'Keep me signed in'}
                </span>
              </label>
              <a href="#" className="text-primary hover:underline transition-all font-black uppercase tracking-widest text-[10px]">
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Reset Password'}
              </a>
            </div>

            {/* Action Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <footer className="mt-12 text-center">
            <p className="text-on-surface-variant text-sm font-medium">
              {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"} 
              <Link to="/register" className="text-primary hover:underline transition-all font-black ml-2">
                {lang === 'ar' ? 'إنشاء حساب جديد' : 'Request Access'}
              </Link>
            </p>
          </footer>
        </motion.div>

        {/* Demo Credentials */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
           {['admin@lms.com', 'ahmed@lms.com', 'rec01', 'nasser@lms.com'].map((id, i) => (
             <button 
               key={id}
               onClick={() => { setLoginId(id); setPassword('password'); }} 
               className="px-4 py-2 bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all shadow-sm"
             >
               {['Admin', 'Trainer', 'Reception', 'Student'][i]}
             </button>
           ))}
        </div>
      </main>
    </div>
  );
};

export default Login;
