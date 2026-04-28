import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import {
  Mail, Fingerprint, Lock, ShieldCheck,
  Save, AlertCircle, CheckCircle2, Loader2, Camera, Printer, GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLang();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus({
        type: 'success',
        msg: lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handlePrintId = () => window.print();
  const isStudent = user?.role === 'student';

  const cardHeaderBg = isStudent
    ? 'linear-gradient(135deg, #4338ca, #6366f1)'
    : 'linear-gradient(135deg, #1e293b, #334155)';

  const cardAccentColor = isStudent ? '#4338ca' : '#334155';

  return (
    <>
      {/* =============================================
          ID CARD PRINT AREA — outside print-hide wrapper
          so it renders correctly during @media print
          ============================================= */}
      <div id="id-card-print-area">
        {/* CR80 standard card: 86mm × 54mm — we center it on A4 */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '86mm',
              height: '54mm',
              backgroundColor: '#ffffff',
              borderRadius: '4mm',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
              border: '0.5mm solid #e2e8f0',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                background: cardHeaderBg,
                height: '18mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4mm',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
                <GraduationCap style={{ width: '5mm', height: '5mm', color: '#fff', opacity: 0.9 }} />
                <div>
                  <p style={{ color: '#fff', fontSize: '3.5mm', fontWeight: 900, lineHeight: 1, margin: 0 }}>
                    Four A Academy
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '2mm', margin: 0, marginTop: '0.5mm', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {isStudent ? 'Student ID Card' : 'Staff ID Card'}
                  </p>
                </div>
              </div>
              {/* Logo badge */}
              <div style={{
                width: '8mm', height: '8mm', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '0.5mm solid rgba(255,255,255,0.3)',
              }}>
                <span style={{ color: '#fff', fontSize: '3mm', fontWeight: 900 }}>4A</span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ flex: 1, display: 'flex', padding: '3mm 4mm', gap: '3mm', alignItems: 'center' }}>
              {/* Photo / Avatar */}
              <div
                style={{
                  width: '14mm',
                  height: '14mm',
                  borderRadius: '2mm',
                  backgroundColor: '#e2e8f0',
                  border: `0.5mm solid ${cardAccentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '6mm',
                  fontWeight: 900,
                  color: cardAccentColor,
                  flexShrink: 0,
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>

              {/* User Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '4mm', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5mm', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '2.8mm', color: cardAccentColor, fontWeight: 700, margin: '0 0 1.5mm', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isStudent ? 'Student' : 'Staff / Employee'}
                </p>
                <p style={{ fontSize: '2.5mm', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div
              style={{
                height: '10mm',
                backgroundColor: '#f8fafc',
                borderTop: '0.4mm solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4mm',
                flexShrink: 0,
              }}
            >
              <div>
                <p style={{ fontSize: '1.8mm', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ID Number</p>
                <p style={{ fontSize: '3mm', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '0.15em' }}>
                  #{user?.id?.toString().padStart(6, '0') ?? '000000'}
                </p>
              </div>

              {/* QR Code placeholder */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5mm', color: '#94a3b8', margin: '0 0 0.5mm', textTransform: 'uppercase' }}>Verify</p>
                <div style={{ width: '7mm', height: '7mm', border: '0.4mm solid #cbd5e1', padding: '0.5mm', backgroundColor: '#fff' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="3" height="3" /><rect x="19" y="19" width="2" height="2" />
                  </svg>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.8mm', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valid Through</p>
                <p style={{ fontSize: '2.8mm', fontWeight: 700, color: '#475569', margin: 0 }}>
                  {new Date().getFullYear() + 1}-12-31
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============================================
          NORMAL PAGE UI (hidden during print)
          ============================================= */}
      <div className="max-w-4xl mx-auto space-y-8 pb-10 print-hide">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
              {lang === 'ar' ? 'الملف الشخصي' : 'User Profile'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {lang === 'ar' ? 'إدارة بياناتك الشخصية وإعدادات الحساب.' : 'Manage your personal details and account settings.'}
            </p>
          </div>
          <button onClick={handlePrintId} className="btn-primary flex items-center gap-2">
            <Printer className="w-5 h-5" />
            {lang === 'ar' ? 'طباعة البطاقة' : 'Print ID Card'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="premium-card overflow-hidden">
              <div
                className="h-24 relative"
                style={{ background: cardHeaderBg }}
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              </div>
              <div className="px-6 pb-8 text-center">
                <div className="relative inline-block -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-[2rem] bg-card border-4 border-card shadow-xl flex items-center justify-center text-primary text-3xl font-black overflow-hidden relative group">
                    {user?.name?.[0] ?? 'U'}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-card rounded-full shadow-sm" />
                </div>
                <h2 className="text-xl font-black text-foreground mb-1">{user?.name}</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{user?.role}</p>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Email Address</p>
                    <p className="text-sm font-bold text-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">User ID</p>
                    <p className="text-sm font-bold text-foreground truncate">#{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card p-6 bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-black text-foreground text-sm uppercase tracking-tight">
                  {lang === 'ar' ? 'حالة الحساب' : 'Account Security'}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {lang === 'ar'
                  ? 'حسابك محمي بنظام التحقق الثنائي. تأكد من تحديث كلمة المرور بشكل دوري.'
                  : 'Your account is protected. Make sure to update your password regularly for better security.'}
              </p>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="lg:col-span-2">
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
                        {lang === 'ar' ? 'حفظ التغييرات' : 'Update Password'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Global print styles */}
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          body > *:not(#id-card-print-area) { display: none !important; }
          #id-card-print-area { display: block !important; }
          @page { size: A4 portrait; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </>
  );
};

export default ProfilePage;
