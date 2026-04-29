import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

const Register: React.FC = () => {
  const { lang, dir, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating registration logic
    setTimeout(() => {
      setIsSubmitting(false);
      alert(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.' : 'Account created successfully! Please sign in.');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary/20 flex items-center justify-center relative overflow-hidden transition-colors duration-700" dir={dir}>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 p-4 md:p-12">
        
        {/* Left Side: Branding and Hero Visual (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center px-12 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent uppercase tracking-tighter">
              4A Academy
            </Link>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-on-background">
              {lang === 'ar' ? <>ابدأ رحلتك نحو <br/> <span className="text-secondary">التميز الأكاديمي</span></> : <>Start Your Journey <br/> to <span className="text-secondary">Academic Elite</span></>}
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md font-medium leading-relaxed">
              {lang === 'ar' 
                ? 'انضم إلى النخبة في أكاديمية 4A حيث نجمع بين الخبرة الملكية والتقنيات الحديثة لتشكيل قادة المستقبل.' 
                : 'Join the elite at 4A Academy, where we blend royal expertise with modern technology to shape the leaders of tomorrow.'}
            </p>
          </motion.div>

          {/* Bento Card Social Proof */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant shadow-sm"
            >
              <span className="material-symbols-outlined text-secondary text-4xl mb-4">school</span>
              <div className="text-on-background font-black text-3xl">+500</div>
              <div className="text-on-surface-variant text-xs font-black uppercase tracking-widest">{lang === 'ar' ? 'خريج معتمد' : 'Verified Alumni'}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant shadow-sm"
            >
              <span className="material-symbols-outlined text-primary text-4xl mb-4">verified</span>
              <div className="text-on-background font-black text-3xl">12</div>
              <div className="text-on-surface-variant text-xs font-black uppercase tracking-widest">{lang === 'ar' ? 'برنامج حصري' : 'Elite Programs'}</div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative h-72 w-full rounded-[2.5rem] overflow-hidden group shadow-2xl border border-outline-variant/30"
          >
            <img 
              className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000" 
              alt="Education" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 right-8 text-white font-bold italic text-lg">
              {lang === 'ar' ? '"التعليم هو جواز سفرنا للمستقبل"' : '"Education is our passport to the future"'}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-6 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[500px] bg-surface-container-lowest border border-outline-variant p-10 md:p-14 rounded-[3rem] shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-on-background tracking-tight">
                  {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                </h2>
                <p className="text-on-surface-variant font-medium text-sm">
                  {lang === 'ar' ? 'انضم إلى عائلة 4A Academy اليوم' : 'Join the 4A Academy family today'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleTheme} className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant hover:text-primary transition-all">
                   <span className="material-symbols-outlined text-[20px]">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
                </button>
                <button onClick={toggleLang} className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant hover:text-primary transition-all font-black text-xs">
                   {lang === 'ar' ? 'EN' : 'عربي'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pr-14 pl-6 text-on-background placeholder:text-on-surface-variant/50 focus:outline-none transition-all font-medium"
                    placeholder={lang === 'ar' ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pr-14 pl-6 text-on-background placeholder:text-on-surface-variant/50 focus:outline-none transition-all font-medium"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pr-14 pl-14 text-on-background placeholder:text-on-surface-variant/50 focus:outline-none transition-all font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  checked={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                  required
                />
                <label htmlFor="terms" className="text-sm text-on-surface-variant font-medium cursor-pointer">
                  {lang === 'ar' ? (
                    <>أوافق على <Link to="/terms" className="text-primary font-bold hover:underline">الشروط والأحكام</Link> الخاصة بالأكاديمية</>
                  ) : (
                    <>I agree to the <Link to="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link></>
                  )}
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-on-surface-variant font-medium text-sm">
                  {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                  <Link to="/login" className="text-primary font-black ml-2 hover:underline">
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Register;
