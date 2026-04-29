import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import {
  Mail, Fingerprint, ShieldCheck, Calendar,
  Printer, GraduationCap, Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLang();

  const handlePrintId = () => window.print();
  const isStudent = user?.role === 'student';

  const cardHeaderBg = isStudent
    ? 'linear-gradient(135deg, #4338ca, #6366f1)'
    : 'linear-gradient(135deg, #1e293b, #334155)';


  return (
    <>

      {/* =============================================
          NORMAL PAGE UI (hidden during print)
          ============================================= */}
      <div className="max-w-4xl mx-auto space-y-8 pb-10 print-hide">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
              {lang === 'ar' ? 'بطاقة التعريف' : 'Identity Card'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {lang === 'ar' ? 'عرض وطباعة بطاقة التعريف الخاصة بك.' : 'View and print your official identity card.'}
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
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Account Created</p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
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

          <div className="lg:col-span-2">
             <div className="premium-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed border-2">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                   <GraduationCap className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-4">
                   {lang === 'ar' ? 'بطاقة الأكاديمية الرسمية' : 'Official Academy ID'}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
                   {lang === 'ar' 
                     ? 'هذه البطاقة هي وثيقتك الرسمية داخل الأكاديمية. يمكنك طباعتها واستخدامها للدخول إلى القاعات والمرافق.'
                     : 'This card is your official document within the academy. You can print it and use it to access halls and facilities.'}
                </p>
                <button onClick={handlePrintId} className="btn-primary flex items-center gap-3 px-8 py-4">
                   <Printer className="w-5 h-5" />
                   {lang === 'ar' ? 'تجهيز للطباعة الآن' : 'Prepare for Printing Now'}
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Local print styles specifically for ID card */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </>
  );
};

export default ProfilePage;
