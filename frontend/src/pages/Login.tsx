import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/';

  const navigateBasedOnRole = (user: any) => {
    if (from && from !== '/' && from !== '/login') {
      navigate(from);
      return;
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin/dashboard');
      return;
    }

    if (user.role === 'student') {
      navigate('/student/dashboard');
      return;
    }

    navigate('/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      navigateBasedOnRole(response.user);
    } catch (err: any) {
      const errorMessage = err?.message || 'Invalid credentials or unable to connect to the server.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-secondary-900/40 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <GraduationCap className="h-8 w-8 text-primary-400" />
          </div>
          <span className="text-2xl font-display font-black text-white tracking-tight">
            FOUR ACADEMY
          </span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            {t('auth.learnFromBest', 'Learn from the best')}
          </div>
          <h1 className="text-5xl font-display font-bold text-white leading-tight mb-6">
            {t('auth.empowerFuture', 'Empower your future with world-class education.')}
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            {t('auth.joinThousands', 'Join thousands of students building their careers with our expert-led, interactive learning platform.')}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" className="w-full h-full" />
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-white font-bold">10k+</span> {t('auth.studentsEnrolled', 'students enrolled')}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-slate-900 transition-colors duration-300">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
            <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            FOUR ACADEMY
          </span>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            {t('auth.welcomeBack', 'Welcome back')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
            {t('auth.enterDetails', 'Please enter your details to sign in.')}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="p-1 bg-rose-100 rounded-lg shrink-0 mt-0.5">
                  <Lock className="h-4 w-4 text-rose-600" />
                </div>
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('auth.email', 'Email Address')}
              </label>
              <div className="relative group">
                <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                  placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.password', 'Password')}
                </label>
                <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition">
                  {t('auth.forgotPassword', 'Forgot password?')}
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center py-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 rounded cursor-pointer dark:bg-slate-800"
              />
              <label htmlFor="remember-me" className="ltr:ml-2 rtl:mr-2 block text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                {t('auth.rememberMe', 'Remember me for 30 days')}
              </label>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold text-white" isLoading={isLoading}>
              {t('auth.signIn', 'Sign In')}
              {!isLoading && <ArrowRight className="ltr:ml-2 rtl:mr-2 h-5 w-5" />}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {t('auth.noAccount', "Don't have an account?")}{' '}
              <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition underline decoration-2 underline-offset-4 decoration-primary-600/30 hover:decoration-primary-600">
                {t('auth.registerHere', 'Register here')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
