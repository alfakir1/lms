import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Lang = 'ar' | 'en';
type Dir  = 'rtl' | 'ltr';

interface LangContextType {
  lang: Lang;
  dir: Dir;
  toggle: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  ar: {
    dashboard: 'لوحة التحكم',
    courses: 'الكورسات',
    enrollments: 'الطلاب المسجلين',
    assignments: 'المهام',
    grades: 'الدرجات',
    payments: 'المدفوعات',
    attendance: 'الحضور',
    users: 'المستخدمين',
    students: 'الطلاب',
    register: 'تسجيل طالب',
    certificates: 'الشهادات',
    logout: 'تسجيل الخروج',
    search: 'بحث...',
    loading: 'جارٍ التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    view: 'عرض',
    submit: 'تسليم',
    enrolled: 'مسجّل',
    enroll: 'تسجيل',
    back: 'رجوع',
    academy_tagline: 'أكاديمية متكاملة',
    login_welcome: 'مرحباً بك مجدداً! سجل دخولك للمتابعة',
    total_users: 'إجمالي المستخدمين',
    active_courses: 'الكورسات الفعالة',
    total_revenue: 'إجمالي الإيرادات',
    total_enrollments: 'عمليات التسجيل',
    feat_title_1: 'نخبة من المدربين',
    feat_title_2: 'مناهج حديثة',
    feat_title_3: 'تدريب عملي',
    feat_title_4: 'شهادات معتمدة',
  },
  en: {
    dashboard: 'Dashboard',
    courses: 'Courses',
    enrollments: 'Enrolled Students',
    assignments: 'Assignments',
    grades: 'Grades',
    payments: 'Payments',
    attendance: 'Attendance',
    users: 'Users',
    students: 'Students',
    register: 'Register Student',
    certificates: 'Certificates',
    logout: 'Logout',
    search: 'Search...',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    view: 'View',
    submit: 'Submit',
    enrolled: 'Enrolled',
    enroll: 'Enroll',
    back: 'Back',
    academy_tagline: 'Integrated Academy',
    login_welcome: 'Welcome back! Login to continue',
    total_users: 'Total Users',
    active_courses: 'Active Courses',
    total_revenue: 'Total Revenue',
    total_enrollments: 'Total Enrollments',
    feat_title_1: 'Expert Trainers',
    feat_title_2: 'Modern Curricula',
    feat_title_3: 'Practical Training',
    feat_title_4: 'Verified Certificates',
  },
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) ?? 'ar');
  const dir: Dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
    document.documentElement.style.fontFamily =
      lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
    localStorage.setItem('lang', lang);
  }, [lang, dir]);

  const toggle = useCallback(() => setLang(l => (l === 'ar' ? 'en' : 'ar')), []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, dir, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
};
