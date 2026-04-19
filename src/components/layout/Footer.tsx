import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-accent-900/10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                {t('footer.title')}
              </span>
            </div>
            <p className="text-neutral-300 dark:text-slate-400 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-soft">
                <span className="text-white font-bold text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-soft">
                <span className="text-white font-bold text-sm">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-soft">
                <span className="text-white font-bold text-sm">i</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-primary-400 transition-all duration-200 hover:translate-x-1 inline-block">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-neutral-300 hover:text-primary-400 transition-all duration-200 hover:translate-x-1 inline-block">
                  {t('nav.courses')}
                </Link>
              </li>
              <li>
                <a href="#about" className="text-neutral-300 hover:text-primary-400 transition-all duration-200 hover:translate-x-1 inline-block">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <Link to="/login" className="text-neutral-300 hover:text-primary-400 transition-all duration-200 hover:translate-x-1 inline-block">
                  {t('nav.login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">{t('footer.contactInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">info@fouracademy.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">123 Learning St, Education City</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">{t('footer.stayUpdated')}</h3>
            <div className="space-y-4">
              <p className="text-neutral-300 text-sm">
                Subscribe to our newsletter for the latest updates and courses.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-l-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-r-xl font-medium transition-all duration-200 shadow-soft hover:shadow-medium">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                {t('footer.support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;