import React from 'react';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useLang } from '../context/LangContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { dir } = useLang();
  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <PublicNav />
      <main className="pt-32 pb-20 max-w-[1440px] mx-auto px-8 min-h-[60vh]">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
