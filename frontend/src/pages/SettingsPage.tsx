import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../api/client';
import {
  Mail, Lock, ShieldCheck, User as UserIcon,
  Save, AlertCircle, CheckCircle2, Loader2, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    setIsUpdatingProfile(true);

    try {
      const response = await api.put('/profile', { name, email });
      updateUser(response.data.user);
      setProfileStatus({
        type: 'success',
        msg: lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully'
      });
    } catch (error: any) {
      setProfileStatus({
        type: 'error',
        msg: error.response?.data?.message || (lang === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating profile')
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put('/profile/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setStatus({
        type: 'success',
        msg: lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setStatus({
        type: 'error',
        msg: error.response?.data?.message || (lang === 'ar' ? 'فشل تحديث كلمة المرور' : 'Failed to update password')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            {lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
          </h1>
          <p className="text-muted-foreground font-medium">
            {lang === 'ar' ? 'إدارة بياناتك الشخصية وإعدادات الأمان.' : 'Manage your personal details and security settings.'}
          </p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-all border border-border shadow-sm"
        >
          <LayoutDashboard className="w-5 h-5" />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
      </motion.div>

      <div className="space-y-8">
        {/* Profile Details Card */}
        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <UserIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {lang === 'ar' ? 'البيانات الشخصية' : 'Personal Details'}
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <AnimatePresence>
              {profileStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 border ${profileStatus.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                >
                  {profileStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-bold">{profileStatus.msg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 px-1">
                  {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-12"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 px-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-8 flex justify-end">
              <button type="submit" disabled={isUpdatingProfile} className="btn-primary min-w-[200px]">
                {isUpdatingProfile ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {lang === 'ar' ? 'حفظ البيانات' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                >
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-bold">{status.msg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 px-1">
                {lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 px-1">
                  {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/70 px-1">
                  {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-8 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[200px]">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
