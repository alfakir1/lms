import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, Loader2, Globe, Moon, Sun, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const { lang, toggle: toggleLang, t } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated — done safely inside useEffect
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || `/${user.role}/dashboard`;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(loginId, password);
      // Navigation is handled by the useEffect above after auth state updates
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="absolute top-6 right-6 flex gap-3">
        <button onClick={toggleTheme} className="p-3 bg-card border border-border rounded-xl shadow-sm hover:bg-muted transition-colors">
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button onClick={toggleLang} className="px-4 py-2 bg-card border border-border rounded-xl shadow-sm hover:bg-muted transition-colors flex items-center gap-2 font-bold text-sm">
          <Globe className="w-4 h-4 text-primary" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-card border border-border rounded-[2rem] shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-6 shadow-2xl shadow-primary/30"
              >
                <GraduationCap className="text-primary-foreground w-10 h-10" />
              </motion.div>
              <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">4A ACADEMY</h1>
              <p className="text-muted-foreground font-medium">{t('login_welcome') || (lang === 'ar' ? 'مرحباً بك مجدداً! سجل دخولك للمتابعة' : 'Welcome back! Login to continue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-destructive/10 text-destructive p-4 rounded-2xl text-sm font-bold border border-destructive/20 flex items-center gap-3"
                >
                  <div className="w-1.5 h-6 bg-destructive rounded-full" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 block px-1">{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="input-field pl-12 pr-6 py-4 rounded-2xl"
                    placeholder={lang === 'ar' ? 'اسم المستخدم أو البريد' : 'Enter your username'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-foreground/80">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">{lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-6 py-4 rounded-2xl"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>{lang === 'ar' ? 'دخول' : 'Sign In'}</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex flex-wrap gap-2 justify-center">
               <button onClick={() => { setLoginId('admin@lms.com'); setPassword('password'); }} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold uppercase transition-colors">Demo Admin</button>
               <button onClick={() => { setLoginId('ahmed@lms.com'); setPassword('password'); }} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold uppercase transition-colors">Demo Trainer</button>
               <button onClick={() => { setLoginId('rec01'); setPassword('password'); }} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold uppercase transition-colors">Demo Reception</button>
               <button onClick={() => { setLoginId('nasser@lms.com'); setPassword('password'); }} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-bold uppercase transition-colors">Demo Student</button>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? 'بدعم من نظام فور أيه الذكي' : 'Powered by 4A Smart Systems'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
