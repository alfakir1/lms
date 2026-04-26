import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center space-y-6">
      <p className="text-[10rem] font-black text-slate-100 leading-none select-none">404</p>
      <div className="-mt-8">
        <h1 className="text-2xl font-bold text-slate-900">الصفحة غير موجودة</h1>
        <p className="text-slate-500 mt-2">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 btn-primary py-3 px-6 rounded-xl"
      >
        <Home className="w-5 h-5" /> العودة للرئيسية
      </Link>
    </div>
  </div>
);

export default NotFound;
