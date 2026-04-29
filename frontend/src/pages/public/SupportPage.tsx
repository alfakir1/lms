import React, { useState } from 'react';
import PublicNav from '../../components/public/PublicNav';
import PublicFooter from '../../components/public/PublicFooter';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

const faqs = [
  { q_ar: 'كيف أبدأ التسجيل في الأكاديمية؟', q_en: 'How do I enroll in the academy?', a_ar: 'اضغط على زر "إنشاء حساب"، أدخل بياناتك، ثم اختر الدورة التي تناسبك وأكمل عملية التسجيل.', a_en: 'Click "Create Account", fill in your details, choose your desired course and complete the enrollment process in minutes.' },
  { q_ar: 'هل الدورات معتمدة دولياً؟', q_en: 'Are the courses internationally accredited?', a_ar: 'نعم، جميع دوراتنا معتمدة من هيئات أكاديمية دولية معترف بها، وتمنح شهادات إتمام رسمية.', a_en: 'Yes, all our courses are accredited by internationally recognized academic bodies and grant official completion certificates.' },
  { q_ar: 'هل يمكنني الدراسة بالسرعة التي تناسبني؟', q_en: 'Can I study at my own pace?', a_ar: 'بالتأكيد! توفر المنصة خيارات تعلم ذاتي مع مرونة تامة في الجدول الزمني.', a_en: 'Absolutely! The platform offers self-paced learning options with full scheduling flexibility.' },
  { q_ar: 'ما هي طرق الدفع المتاحة؟', q_en: 'What payment methods are available?', a_ar: 'نقبل التحويل البنكي، بطاقات الائتمان والخصم، وعدة محافظ رقمية في المنطقة العربية.', a_en: 'We accept bank transfers, credit/debit cards, and several digital wallets across the Arab region.' },
  { q_ar: 'كيف أتواصل مع المحاضر؟', q_en: 'How do I contact my instructor?', a_ar: 'يمكنك التواصل مع المحاضر عبر لوحة التحكم الخاصة بك من خلال نظام الرسائل الداخلي أو جلسات المكتب المفتوح.', a_en: 'You can reach your instructor via the internal messaging system or scheduled open office sessions in your dashboard.' },
  { q_ar: 'هل هناك نسخة تجريبية مجانية؟', q_en: 'Is there a free trial?', a_ar: 'نعم، يمكنك تجربة أول درسين من أي دورة مجاناً قبل اتخاذ قرار الشراء.', a_en: 'Yes, you can preview the first two lessons of any course for free before making a purchase decision.' },
];

const SupportPage: React.FC = () => {
  const { lang, dir } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background" dir={dir}>
      <PublicNav />

      {/* Hero */}
      <section className="pt-48 pb-24 text-center">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 bg-secondary/10 text-secondary font-black text-[10px] uppercase tracking-[0.25em] rounded-full border border-secondary/20 mb-8"
          >
            {lang === 'ar' ? 'مركز المساعدة' : 'Help Center'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter text-on-background leading-[1.05] mb-8"
          >
            {lang === 'ar' ? <>كيف يمكننا<br /><span className="text-primary-container">مساعدتك؟</span></> : <>How Can We<br /><span className="text-primary-container">Help You?</span></>}
          </motion.h1>
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-20">
        <div className="max-w-[1000px] mx-auto px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: 'chat', title_ar: 'الدردشة المباشرة', title_en: 'Live Chat', desc_ar: 'دعم فوري في الوقت الحقيقي', desc_en: 'Real-time instant support' },
            { icon: 'email', title_ar: 'راسلنا', title_en: 'Email Us', desc_ar: 'support@4aacademy.com', desc_en: 'support@4aacademy.com' },
            { icon: 'call', title_ar: 'اتصل بنا', title_en: 'Call Us', desc_ar: '+966 XX XXX XXXX', desc_en: '+966 XX XXX XXXX' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-8 bg-surface-container-lowest border border-outline-variant rounded-[2rem] text-center group hover:border-primary/30 hover:shadow-premium transition-all cursor-pointer"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <h4 className="font-black text-on-background mb-2">{lang === 'ar' ? item.title_ar : item.title_en}</h4>
              <p className="text-on-surface-variant text-sm font-medium">{lang === 'ar' ? item.desc_ar : item.desc_en}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-[900px] mx-auto px-8">
          <h2 className="text-4xl font-black text-on-background tracking-tighter mb-12 text-center">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-start gap-4 group"
                >
                  <span className="font-black text-on-background text-lg leading-snug">
                    {lang === 'ar' ? faq.q_ar : faq.q_en}
                  </span>
                  <span className={`material-symbols-outlined text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-on-surface-variant font-medium leading-relaxed border-t border-outline-variant/30 pt-4">
                        {lang === 'ar' ? faq.a_ar : faq.a_en}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32">
        <div className="max-w-[700px] mx-auto px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-on-background tracking-tighter mb-4">
              {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {lang === 'ar' ? 'سيرد عليك فريقنا خلال 24 ساعة.' : 'Our team will respond within 24 hours.'}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-16 bg-secondary/10 rounded-[2.5rem] border border-secondary/20"
            >
              <span className="material-symbols-outlined text-secondary text-7xl mb-6 block">check_circle</span>
              <h3 className="text-3xl font-black text-on-background mb-4">
                {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent!'}
              </h3>
              <p className="text-on-surface-variant font-medium">
                {lang === 'ar' ? 'شكراً لتواصلك. سيرد فريقنا قريباً.' : 'Thank you for reaching out. Our team will respond shortly.'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    {lang === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-on-background focus:border-primary focus:outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-on-background focus:border-primary focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                  {lang === 'ar' ? 'الموضوع' : 'Subject'}
                </label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder={lang === 'ar' ? 'موضوع رسالتك' : 'Message subject'}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-on-background focus:border-primary focus:outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                  {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-on-background focus:border-primary focus:outline-none transition-all font-medium resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-5 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {sending ? <div className="w-6 h-6 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <>
                  <span className="material-symbols-outlined">send</span>
                  {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </>}
              </button>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default SupportPage;

