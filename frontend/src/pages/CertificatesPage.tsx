import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Search, Printer, BookOpen, CheckCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Certificate } from '../types';

// Helper: Get theme by course ID
const getCertificateStyle = (id: number = 0) => {
  const styles = [
    { borderColor: '#1e293b', bgColor: '#f8fafc', textColor: '#0f172a', accentColor: '#1e293b', ribbonBg: '#1e293b' },
    { borderColor: '#312e81', bgColor: '#f0f0ff', textColor: '#1e1b4b', accentColor: '#3730a3', ribbonBg: '#312e81' },
    { borderColor: '#14532d', bgColor: '#f0fff4', textColor: '#14532d', accentColor: '#166534', ribbonBg: '#14532d' },
    { borderColor: '#881337', bgColor: '#fff0f3', textColor: '#4c0519', accentColor: '#9f1239', ribbonBg: '#881337' },
  ];
  return styles[id % styles.length];
};

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
    setTimeout(() => window.print(), 600);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'B': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'C': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'D': return 'bg-orange-50 text-orange-600 border-orange-200';
      default:  return 'bg-red-50 text-red-600 border-red-200';
    }
  };

  const certStyle = printingCert
    ? getCertificateStyle(printingCert.course?.id ?? 0)
    : getCertificateStyle(0);

  return (
    <>
      {/* ========================================
          PRINTABLE CERTIFICATE — rendered OUTSIDE
          any print-hide wrapper so @media print
          can show it correctly.
          ======================================== */}
      <div id="cert-print-area">
        {printingCert && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: certStyle.bgColor,
            }}
          >
            {/* A4 Landscape container: 297mm × 210mm */}
            <div
              style={{
                width: '297mm',
                height: '210mm',
                backgroundColor: '#ffffff',
                border: `14mm double ${certStyle.borderColor}`,
                padding: '10mm 14mm',
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Georgia, "Times New Roman", serif',
                overflow: 'hidden',
              }}
            >
              {/* Corner ornaments */}
              {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                <div key={`${v}-${h}`} style={{
                  position: 'absolute',
                  [v]: '8mm',
                  [h]: '8mm',
                  width: '14mm',
                  height: '14mm',
                  borderTop: v === 'top' ? `3px solid ${certStyle.borderColor}` : 'none',
                  borderBottom: v === 'bottom' ? `3px solid ${certStyle.borderColor}` : 'none',
                  borderLeft: h === 'left' ? `3px solid ${certStyle.borderColor}` : 'none',
                  borderRight: h === 'right' ? `3px solid ${certStyle.borderColor}` : 'none',
                  opacity: 0.6,
                }} />
              ))}

              {/* Watermark */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.03,
                pointerEvents: 'none',
              }}>
                <Award style={{ width: '130mm', height: '130mm', color: certStyle.borderColor }} />
              </div>

              {/* HEADER */}
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '4.5mm', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#64748b', margin: '0 0 3mm' }}>
                  Four A Academy for Professional Training
                </p>
                <h1 style={{
                  fontSize: '11mm',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: certStyle.accentColor,
                  margin: '0 0 4mm',
                }}>
                  Certificate of Completion
                </h1>
                <div style={{ width: '80mm', height: '1px', backgroundColor: certStyle.borderColor, margin: '0 auto', opacity: 0.3 }} />
              </div>

              {/* BODY */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
              }}>
                <p style={{ fontSize: '4.5mm', color: '#64748b', fontStyle: 'italic', marginBottom: '5mm' }}>
                  This is to proudly certify that
                </p>
                <h2 style={{
                  fontSize: '13mm',
                  fontWeight: 900,
                  color: certStyle.textColor,
                  marginBottom: '5mm',
                  lineHeight: 1.1,
                }}>
                  {printingCert.student?.user?.name}
                </h2>
                <p style={{ fontSize: '4mm', color: '#64748b', fontStyle: 'italic', marginBottom: '4mm' }}>
                  has successfully completed the course
                </p>
                <h3 style={{
                  fontSize: '8mm',
                  fontWeight: 700,
                  color: certStyle.accentColor,
                  maxWidth: '200mm',
                  lineHeight: 1.25,
                  marginBottom: '6mm',
                }}>
                  {printingCert.course?.title}
                </h3>
                <p style={{ fontSize: '3.8mm', color: '#475569', maxWidth: '180mm' }}>
                  with a final grade of{' '}
                  <strong style={{ fontSize: '4.5mm', color: certStyle.textColor }}>
                    {printingCert.grade} ({printingCert.percentage}%)
                  </strong>
                </p>
              </div>

              {/* FOOTER */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingBottom: '4mm',
                paddingInline: '10mm',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Left signature */}
                <div style={{ textAlign: 'center', width: '55mm' }}>
                  <div style={{
                    borderBottom: `1px solid #94a3b8`,
                    height: '16mm',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '2mm',
                    marginBottom: '2mm',
                  }}>
                    <span style={{ fontStyle: 'italic', fontSize: '5mm', color: certStyle.accentColor }}>
                      Four A Academy
                    </span>
                  </div>
                  <p style={{ fontSize: '3mm', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Academy Director
                  </p>
                </div>

                {/* Center seal */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '26mm',
                    height: '26mm',
                    borderRadius: '50%',
                    border: `2px dashed ${certStyle.borderColor}`,
                    padding: '3mm',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: certStyle.ribbonBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CheckCircle style={{ width: '8mm', height: '8mm', color: '#fff' }} />
                    </div>
                  </div>
                </div>

                {/* Right: QR + Date */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6mm' }}>
                  {/* QR placeholder */}
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5mm', color: '#94a3b8', marginBottom: '1.5mm', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Verify
                    </p>
                    <div style={{
                      width: '18mm',
                      height: '18mm',
                      border: '1px solid #cbd5e1',
                      padding: '1.5mm',
                      backgroundColor: '#fff',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={certStyle.borderColor} strokeWidth="1.5" style={{ width: '100%', height: '100%' }}>
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" /><rect x="19" y="14" width="2" height="2" /><rect x="14" y="19" width="2" height="2" /><rect x="19" y="19" width="2" height="2" />
                        <rect x="17" y="17" width="1" height="1" />
                      </svg>
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'center', width: '55mm' }}>
                    <div style={{
                      borderBottom: `1px solid #94a3b8`,
                      height: '16mm',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '2mm',
                      marginBottom: '2mm',
                    }}>
                      <span style={{ fontSize: '4mm', color: '#334155' }}>
                        {new Date(printingCert.issued_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p style={{ fontSize: '3mm', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      Date of Issue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================
          NORMAL PAGE UI (hidden during print)
          ====================================== */}
      <div className="space-y-6 max-w-7xl mx-auto print-hide">
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
            <input
              type="text"
              placeholder="بحث باسم الطالب أو الكورس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
              dir="rtl"
            />
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
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group flex flex-col"
              >
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
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cert.course?.title}</span>
                </p>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    إصدار: {new Date(cert.issued_at).toLocaleDateString('ar-EG')}
                  </p>
                  {(user?.role === 'admin' || user?.role === 'reception') && (
                    <button
                      onClick={() => handlePrint(cert)}
                      className="flex items-center gap-1.5 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> طباعة
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Global print styles */}
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          body > *:not(#cert-print-area) { display: none !important; }
          #cert-print-area { display: block !important; }
          @page { size: A4 landscape; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </>
  );
};

export default CertificatesPage;
