import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(identifier, password);

    if (success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'instructor') navigate('/instructor/dashboard');
      else if (user.role === 'reception') navigate('/reception/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft w-full max-w-md border border-neutral-100 dark:border-slate-800 rtl:text-right">
        <h2 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-2">
          {t('auth.welcomeBack')}
        </h2>
        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-8">
          {t('auth.loginSubtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('auth.email')} / {t('student.id')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white rtl:text-right"
              placeholder={t('auth.placeholderEmailId', 'Email or Student ID')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white rtl:text-right"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-all transform active:scale-[0.98]"
          >
            {t('auth.signIn')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-slate-800 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-neutral-50 dark:bg-slate-800 rounded-2xl border border-dashed border-neutral-200 dark:border-slate-700">
          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 text-center">
            {t('auth.demoTitle')}
          </p>
          <div className="space-y-2 text-[10px]">
            <p className="flex justify-between flex-wrap gap-1 rtl:flex-row-reverse items-center">
              <span className="text-neutral-500 font-bold">{t('common.student')}:</span>
              <code className="text-primary-600 dark:text-primary-400 font-mono">student@four.com ({t('common.or', 'or')} STU-1001) / password123</code>
            </p>
            <p className="flex justify-between flex-wrap gap-1 rtl:flex-row-reverse items-center">
              <span className="text-neutral-500 font-bold">{t('common.instructor')}:</span>
              <code className="text-primary-600 dark:text-primary-400 font-mono">sarah@four.com / password123</code>
            </p>
            <p className="flex justify-between flex-wrap gap-1 rtl:flex-row-reverse items-center">
              <span className="text-neutral-500 font-bold">{t('common.reception')}:</span>
              <code className="text-primary-600 dark:text-primary-400 font-mono">reception@four.com / password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;