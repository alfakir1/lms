import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft w-full max-w-md border border-neutral-100 dark:border-slate-800 rtl:text-right">
        <h2 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-2">
          {t('auth.signUp')}
        </h2>
        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-8">
          {t('auth.joinSubtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('auth.fullName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white rtl:text-right"
              placeholder={t('auth.placeholderName')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white rtl:text-right"
              placeholder="email@example.com"
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

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              {t('auth.roleLabel')}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white appearance-none rtl:text-right"
            >
              <option value="student">{t('common.student')}</option>
              <option value="instructor">{t('common.instructor')}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-all transform active:scale-[0.98]"
          >
            {t('auth.signUp')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-slate-800 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('auth.alreadyAccount')}{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;