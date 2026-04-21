import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateBasedOnRole = (user: any) => {
    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/${user.role}/dashboard`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try real API first
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigateBasedOnRole(response.data.user);
    } catch (err: any) {
      console.warn('API login failed, trying mock fallback...', err);
      
      // Fallback to mock data for development
      const { mockUsers } = await import('../utils/mockData');
      const mockUser = mockUsers.find(u => 
        (u.email === email || u.student_id === email) && u.password === password
      );

      if (mockUser) {
        login(mockUser, 'mock-token-' + Date.now());
        navigateBasedOnRole(mockUser);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <div className="p-3 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-all duration-300">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent">
            FOUR ACADEMY
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          {t('auth.loginTitle', 'Welcome Back')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
          {t('auth.loginSubtitle', 'Sign in to access your learning portal')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-10 px-8 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in shake duration-300">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                {t('auth.emailOrId', 'Email or Student ID')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-900 dark:text-white font-medium"
                  placeholder={t('auth.placeholderEmail', 'Enter your email or ID')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-900 dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between ml-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t('auth.rememberMe', 'Remember me')}
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                  {t('auth.forgotPassword', 'Forgot password?')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-primary-500/20 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  t('auth.signIn', 'Sign In')
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm font-bold uppercase tracking-widest">
                <span className="px-4 bg-white dark:bg-slate-900 text-slate-400">
                  {t('auth.orContinue', 'OR')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {t('auth.noAccount', "Don't have an account?")}{' '}
                <Link to="/register" className="font-black text-emerald-600 hover:text-emerald-500 transition-colors uppercase">
                  {t('auth.contactReception', 'Contact Reception')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;