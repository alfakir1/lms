import React, { useState } from 'react';
import PublicNav from '../../components/public/PublicNav';
import PublicFooter from '../../components/public/PublicFooter';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'privacy', label_ar: 'سياسة الخصوصية', label_en: 'Privacy Policy' },
  { id: 'terms',   label_ar: 'شروط الاستخدام',   label_en: 'Terms of Service' },
];

const LegalPage: React.FC = () => {
  const { lang, dir } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'privacy';

  const setTab = (tab: string) => setSearchParams({ tab });

  const content = {
    privacy: {
      title_ar: 'سياسة الخصوصية',
      title_en: 'Privacy Policy',
      lastUpdated: '2024-01-01',
      sections_ar: [
        { title: 'المعلومات التي نجمعها', body: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل معلومات الحساب (الاسم، البريد الإلكتروني) وبيانات الاستخدام وبيانات الدفع المشفرة.' },
        { title: 'كيفية استخدام المعلومات', body: 'نستخدم المعلومات المجمعة لتقديم خدماتنا التعليمية، وتحسين تجربة المستخدم، وإرسال التحديثات المتعلقة بالدورات، وضمان أمان المنصة.' },
        { title: 'مشاركة المعلومات', body: 'لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك المعلومات مع مزودي الخدمة الموثوقين لأغراض تشغيل المنصة فقط.' },
        { title: 'أمان البيانات', body: 'نستخدم تشفير TLS/SSL لحماية بياناتك أثناء النقل، ونطبق معايير أمنية صارمة لحماية بياناتك المحفوظة.' },
        { title: 'حقوقك', body: 'يحق لك الوصول إلى بياناتك وتصحيحها أو حذفها في أي وقت عبر إعدادات حسابك أو بالتواصل مع فريق الدعم.' },
      ],
      sections_en: [
        { title: 'Information We Collect', body: 'We collect information you provide directly, including account data (name, email), usage analytics, and encrypted payment information.' },
        { title: 'How We Use Information', body: 'We use collected information to deliver educational services, improve user experience, send course-related updates, and ensure platform security.' },
        { title: 'Information Sharing', body: 'We do not sell your personal data to any third party. We may share information with trusted service providers solely for platform operation purposes.' },
        { title: 'Data Security', body: 'We employ TLS/SSL encryption to protect your data in transit and implement strict security standards to safeguard stored data.' },
        { title: 'Your Rights', body: 'You have the right to access, correct, or delete your data at any time through your account settings or by contacting our support team.' },
      ],
    },
    terms: {
      title_ar: 'شروط الاستخدام',
      title_en: 'Terms of Service',
      lastUpdated: '2024-01-01',
      sections_ar: [
        { title: 'قبول الشروط', body: 'باستخدامك للمنصة، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المنصة.' },
        { title: 'حساب المستخدم', body: 'أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تتم من خلال حسابك.' },
        { title: 'حقوق الملكية الفكرية', body: 'جميع المحتويات المقدمة على المنصة محمية بحقوق الملكية الفكرية. لا يجوز نسخ أو توزيع المحتوى دون إذن صريح.' },
        { title: 'سياسة الاسترداد', body: 'يمكنك طلب استرداد المبلغ خلال 7 أيام من تاريخ الشراء إذا أتممت أقل من 20% من محتوى الدورة.' },
        { title: 'إنهاء الخدمة', body: 'نحتفظ بالحق في إنهاء أو تعليق حسابك في حالة انتهاك هذه الشروط أو أي نشاط احتيالي.' },
      ],
      sections_en: [
        { title: 'Acceptance of Terms', body: 'By using the platform, you agree to these terms and conditions. If you do not agree with any part of them, please refrain from using the platform.' },
        { title: 'User Account', body: 'You are responsible for maintaining the confidentiality of your account information and all activities that occur through your account.' },
        { title: 'Intellectual Property', body: 'All content provided on the platform is protected by intellectual property rights. Copying or distributing content without explicit permission is prohibited.' },
        { title: 'Refund Policy', body: 'You may request a refund within 7 days of purchase if you have completed less than 20% of the course content.' },
        { title: 'Service Termination', body: 'We reserve the right to terminate or suspend your account in the event of violations of these terms or any fraudulent activity.' },
      ],
    },
  };

  const current = content[activeTab as keyof typeof content];
  const sections = lang === 'ar' ? current.sections_ar : current.sections_en;

  return (
    <div className="min-h-screen bg-background text-on-background" dir={dir}>
      <PublicNav />

      <section className="pt-40 pb-16 border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-on-background tracking-tighter mb-6"
          >
            {lang === 'ar' ? current.title_ar : current.title_en}
          </motion.h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
            {lang === 'ar' ? `آخر تحديث: ${current.lastUpdated}` : `Last Updated: ${current.lastUpdated}`}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-primary/30'
                }`}
              >
                {lang === 'ar' ? tab.label_ar : tab.label_en}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-8 space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-b border-outline-variant/30 pb-12 last:border-0"
            >
              <div className="flex items-start gap-6 mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 mt-1">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-black text-on-background tracking-tight">{section.title}</h3>
              </div>
              <p className="text-on-surface-variant font-medium leading-relaxed text-lg ms-16">{section.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LegalPage;

