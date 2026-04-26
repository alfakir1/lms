import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Search, Printer, BookOpen, CheckCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Certificate } from '../types';

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [printingCert, setPrintingCert] = useState<Certificate | null>(null);

  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: () => api.get('/certificates').then(r => (r.data as any).data || r.data),
  });

  const displayCerts = certificates.filter(c => 
    c.student?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    c.course?.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = (cert: Certificate) => {
    setPrintingCert(cert);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'A': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'B': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'C': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'D': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-red-50 text-red-600 border-red-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> شهادات الطلاب
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.role === 'instructor' 
              ? 'عرض الشهادات لطلاب الكورسات التي تديرها'
              : 'إدارة وطباعة شهادات إتمام الكورسات'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="font-bold text-slate-900">سجل الشهادات</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="بحث باسم الطالب أو الكورس..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right" dir="rtl" />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : displayCerts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-semibold">لا توجد شهادات متاحة بعد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCerts.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 ${getGradeColor(cert.grade)}`}>
                  {cert.grade || 'N/A'}
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900">{cert.percentage}%</p>
                  <p className="text-xs text-slate-400">النسبة النهائية</p>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 truncate">{cert.student?.user?.name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> {cert.course?.title}
              </p>
              
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> إصدار: {new Date(cert.issued_at).toLocaleDateString('ar-EG')}
                </p>
                
                {/* Only Admin & Reception can print */}
                {(user?.role === 'admin' || user?.role === 'reception') && (
                  <button onClick={() => handlePrint(cert)}
                    className="flex items-center gap-1.5 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    <Printer className="w-3.5 h-3.5" /> طباعة
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Printable Area (Hidden normally, shown in @media print) */}
      {printingCert && (
        <div id="print-certificate-area" className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl mx-auto border-[16px] border-double border-slate-200 p-16 text-center space-y-8 bg-slate-50">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
              <span className="text-white text-4xl font-black">4A</span>
            </div>
            
            <h1 className="text-5xl font-black text-slate-900 tracking-wider">شهادة إتمام كورس</h1>
            <p className="text-2xl text-slate-500">تُمنح هذه الشهادة للطالب</p>
            
            <h2 className="text-6xl font-bold text-primary py-4">{printingCert.student?.user?.name}</h2>
            
            <p className="text-2xl text-slate-500">
              لاجتيازه بنجاح كورس <br/><br/>
              <strong className="text-4xl text-slate-900">{printingCert.course?.title}</strong>
            </p>
            
            <div className="flex justify-center items-center gap-12 pt-12 mt-12 border-t-2 border-slate-200">
              <div className="text-center">
                <p className="text-slate-500">التقدير</p>
                <p className={`text-4xl font-black mt-2 ${getGradeColor(printingCert.grade).split(' ')[1]}`}>{printingCert.grade}</p>
              </div>
              <div className="text-center border-r-2 border-l-2 border-slate-200 px-12">
                <p className="text-slate-500">النسبة المئوية</p>
                <p className="text-4xl font-black mt-2 text-slate-900">{printingCert.percentage}%</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500">تاريخ الإصدار</p>
                <p className="text-2xl font-bold mt-2 text-slate-900">{new Date(printingCert.issued_at).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
            
            <div className="pt-20 flex justify-between px-20">
              <div className="border-t-2 border-slate-400 pt-4 w-48">توقيع المدرب</div>
              <div className="border-t-2 border-slate-400 pt-4 w-48">إدارة الأكاديمية</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body > *:not(#print-certificate-area) { display: none !important; }
          #print-certificate-area { display: flex !important; }
          @page { size: landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default CertificatesPage;
