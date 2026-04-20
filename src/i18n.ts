import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

// Restore persisted language from localStorage (default to 'en')
const savedLang = localStorage.getItem('language') as 'en' | 'ar' | null;
const initialLang: 'en' | 'ar' = savedLang === 'ar' ? 'ar' : 'en';

// Apply RTL/LTR immediately on load to prevent layout flicker
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar }
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
