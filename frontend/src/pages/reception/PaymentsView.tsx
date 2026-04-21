import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  Printer,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { mockPayments, mockUsers, mockCourses } from '../../utils/mockData';

const PaymentsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const getStudent = (id: number) => mockUsers.find(u => u.id === id);
  const getCourse = (id: number) => mockCourses.find(c => c.id === id);

  const filteredPayments = mockPayments.filter(p => 
    (getStudent(p.student_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (getCourse(p.course_id)?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  const handlePrintClick = (payment: any) => {
    const student = getStudent(payment.student_id);
    const course = getCourse(payment.course_id);
    
    setSelectedPayment({
      ...payment,
      studentName: student?.name,
      studentEmail: student?.email,
      studentId: student?.student_id || 'N/A',
      courseTitle: course?.title,
      receiptId: `REC-${100000 + payment.id}`,
      date: new Date(payment.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      receptionist: t('reception.staff', 'Administrative Staff')
    });
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden rtl:flex-row-reverse">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.payments')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.paymentsSubtitle', 'Track and manage student payment transactions.')}
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-neutral-100 dark:border-slate-800 shadow-soft rtl:flex-row-reverse">
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 bg-transparent outline-none text-sm w-64 rtl:text-right"
              placeholder={t('reception.searchPayments', 'Search payments...')}
            />
          </div>
          <button className="p-2 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Filter size={18} className="text-neutral-500" />
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-slate-800/50">
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('reception.receipt.date')}</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('reception.receipt.student')}</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('reception.receipt.course')}</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('reception.receipt.amount')}</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('reception.receipt.status')}</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right rtl:text-left">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-neutral-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 rtl:flex-row-reverse">
                      <div className={`p-2 rounded-xl ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {payment.status === 'completed' ? <ArrowDownLeft size={16} /> : <Clock size={16} />}
                      </div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 whitespace-nowrap">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{getStudent(payment.student_id)?.name}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{getCourse(payment.course_id)?.title}</p>
                  </td>
                  <td className="p-6 whitespace-nowrap">
                    <span className="text-sm font-black text-neutral-900 dark:text-white">{String(t('common.currency', { val: payment.amount }))}</span>
                  </td>
                  <td className="p-6 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      payment.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {payment.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {String(t(`common.${payment.status}`, payment.status))}
                    </span>
                  </td>
                  <td className="p-6 whitespace-nowrap text-right rtl:text-left">
                    <div className="flex justify-end rtl:justify-start gap-2">
                      <button 
                        onClick={() => handlePrintClick(payment)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-xl transition-all text-neutral-400 hover:text-primary-600"
                      >
                        <Printer size={18} />
                      </button>
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-xl transition-all text-neutral-400 hover:text-neutral-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300 print:bg-white print:p-0">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 print:shadow-none print:rounded-none print:max-w-none print:max-h-none print:overflow-visible">
            {/* Receipt Content for Printing */}
            <div id="receipt-content" className="p-10 space-y-8 print:p-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex justify-between items-start rtl:flex-row-reverse">
                <div className="flex gap-4 items-center rtl:flex-row-reverse">
                  <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                    4
                  </div>
                  <div className="space-y-0.5 rtl:text-right">
                    <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">{t('footer.title', 'FOUR ACADEMY')}</h2>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('common.premiumLearning', 'Premium Learning')}</p>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
                    selectedPayment.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                  } text-white`}>
                    {selectedPayment.status === 'completed' ? t('reception.receipt.paymentSuccess', 'Payment Success') : t('reception.receipt.paymentPending', 'Payment Pending')}
                  </div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.number')}</p>
                  <p className="font-bold text-neutral-900 dark:text-white">#{selectedPayment.receiptId}</p>
                </div>
              </div>

              <div className="py-6 border-y border-neutral-100 dark:border-slate-800 flex justify-between items-center rtl:flex-row-reverse">
                <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">{t('reception.receipt.title', 'Payment Receipt')}</h1>
                <div className="text-right rtl:text-left">
                   <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.dateIssued', 'Date Issued')}</p>
                   <p className="font-bold text-neutral-900 dark:text-white text-sm">{selectedPayment.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 rtl:text-right">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.studentDetails', 'Student Details')}</p>
                    <p className="font-black text-neutral-900 dark:text-white text-lg">{selectedPayment.studentName}</p>
                    <p className="text-sm text-neutral-500">{selectedPayment.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('student.id')}</p>
                    <p className="font-black text-primary-600 text-xl tracking-wider">{selectedPayment.studentId}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-right rtl:text-left">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.enrolledCourse', 'Enrolled Course')}</p>
                    <p className="font-black text-neutral-900 dark:text-white">{selectedPayment.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.paymentStatus', 'Payment Status')}</p>
                    <p className="font-bold text-neutral-900 dark:text-white capitalize">{String(t(`common.${selectedPayment.status}`, selectedPayment.status))}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-slate-800/50 p-6 rounded-[2rem] flex justify-between items-center rtl:flex-row-reverse">
                <div className="rtl:text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.totalAmount', 'Total Amount')}</p>
                  <p className="text-neutral-500 text-xs italic">{t('reception.receipt.taxesIncl', 'All taxes included')}</p>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="text-4xl font-black text-primary-600 tracking-tighter">{String(t('common.currency', { val: selectedPayment.amount }))}</p>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-dashed border-neutral-200 dark:border-slate-700 rtl:flex-row-reverse">
                <div className="space-y-1 rtl:text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.processedBy', 'Processed By')}</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{selectedPayment.receptionist}</p>
                </div>
                <div className="text-right rtl:text-left max-w-[200px]">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{t('reception.receipt.officialStamp', 'Official Stamp')}</p>
                  <div className="w-20 h-20 border-2 border-primary-600/20 rounded-full ml-auto mr-0 rtl:ml-0 rtl:mr-auto flex items-center justify-center">
                    <CheckCircle2 className="text-primary-600/20" size={32} />
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.thankYou', 'Thank you for choosing Four Academy!')}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 p-6 bg-neutral-50 dark:bg-slate-800 border-t border-neutral-100 dark:border-slate-700 flex gap-3 print:hidden rtl:flex-row-reverse">
              <button 
                onClick={handlePrint}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold shadow-glow transition-all flex items-center justify-center gap-2 rtl:flex-row-reverse"
              >
                <Printer size={18} />
                <span>{t('reception.printReceipt')}</span>
              </button>
              <button 
                onClick={() => setShowReceipt(false)}
                className="px-8 py-4 bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 text-neutral-600 dark:text-neutral-300 rounded-2xl font-bold hover:bg-neutral-50 transition-all"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 2cm !important;
            background: white !important;
            color: black !important;
          }
          .dark #receipt-content {
            background: white !important;
            color: black !important;
          }
          .dark #receipt-content * {
            color: black !important;
            border-color: #eee !important;
          }
          .dark #receipt-content .bg-primary-600 {
             background-color: #2563eb !important;
             -webkit-print-color-adjust: exact;
          }
          .dark #receipt-content .text-primary-600 {
             color: #2563eb !important;
          }
          .dark #receipt-content .bg-emerald-500 {
             background-color: #10b981 !important;
             -webkit-print-color-adjust: exact;
          }
          .dark #receipt-content .bg-neutral-50 {
             background-color: #f9fafb !important;
             -webkit-print-color-adjust: exact;
          }
        }
      `}} />
    </div>
  );
};

export default PaymentsView;
