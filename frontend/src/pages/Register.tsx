import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Phone, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError(t('auth.passwordsMismatch') || 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await authService.register({
        name,
        email,
        phone: phone.trim() ? phone.trim() : undefined,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });

      login(resp.user, resp.token);
      showSuccess('Account created successfully.');
      navigate(role === 'instructor' ? '/courses' : '/student/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-slate-900 to-primary-900/40 z-0"></div>
        <div className="absolute top-20 -left-40 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <GraduationCap className="h-8 w-8 text-secondary-400" />
          </div>
          <span className="text-2xl font-display font-black text-white tracking-tight">
            FOUR ACADEMY
          </span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-300 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            {t('auth.joinSubtitle')}
          </div>
          <h1 className="text-5xl font-display font-bold text-white leading-tight mb-6">
            {t('auth.joinTitle')}
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Create an account to access premium courses, track your progress, and join our thriving community of learners and educators.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-slate-900 overflow-y-auto transition-colors duration-300">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="p-3 bg-secondary-50 rounded-2xl">
            <GraduationCap className="h-8 w-8 text-secondary-600" />
          </div>
          <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            FOUR ACADEMY
          </span>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            {t('auth.signUp')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
            {t('auth.joinSubtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="p-1 bg-rose-100 rounded-lg shrink-0 mt-0.5">
                  <UserPlus className="h-4 w-4 text-rose-600" />
                </div>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.fullName')}</label>
                <div className="relative group">
                  <User className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-secondary-500 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                    placeholder={t('auth.placeholderName') || 'John Doe'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.phone') || 'Phone (Optional)'}</label>
                <div className="relative group">
                  <Phone className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-secondary-500 transition-colors" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                    placeholder="+1..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.email')}</label>
              <div className="relative group">
                <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-secondary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.roleLabel')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'var(--select-bg-pos, right 0.5rem center)', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="student">{t('auth.studentRole')}</option>
                <option value="instructor">{t('auth.instructorRole')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.password')}</label>
                <div className="relative group">
                  <Lock className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-secondary-500 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('auth.confirmPassword')}</label>
                <div className="relative group">
                  <Lock className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-secondary-500 transition-colors" />
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:font-normal placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold mt-2" isLoading={isLoading} style={{ backgroundColor: 'var(--color-secondary-600)', borderColor: 'var(--color-secondary-600)' }}>
              {t('auth.createAccount')}
              {!isLoading && <ArrowRight className="ltr:ml-2 rtl:mr-2 h-5 w-5" />}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {t('auth.alreadyAccount')}{' '}
              <Link to="/login" className="font-semibold text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition underline decoration-2 underline-offset-4 decoration-secondary-600/30 hover:decoration-secondary-600">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
