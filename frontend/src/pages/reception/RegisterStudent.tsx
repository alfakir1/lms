import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  User, 
  BookOpen, 
  Printer, 
  CheckCircle2
} from 'lucide-react';
import { mockCourses, mockUsers } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';

const RegisterStudent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth(); // Get current receptionist name
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    courseId: '',
    paymentMethod: 'cash'
  });

  const generateStudentId = () => {
    const lastId = 1004 + mockUsers.length; // Simple increment based on mock users
    return `STU-${lastId}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Random 8-character password
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = generateStudentId();
    const password = generatePassword();
    const selectedCourse = mockCourses.find(c => c.id === Number(formData.courseId));
    const now = new Date().toISOString().split('T')[0];

    // Add the new student to mockUsers so they can login immediately
    const newStudent: any = {
      id: Date.now(),
      student_id: studentId,
      name: formData.name,
      email: formData.email,
      password: password,
      role: 'student',
      created_at: now,
      updated_at: now
    };
    mockUsers.push(newStudent);
    
    setReceiptData({
      ...formData,
      studentId,
      password,
      courseTitle: selectedCourse?.title,
      price: selectedCourse?.price,
      receiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      receptionist: user?.name || t('reception.adminStaff', 'Administrative Staff')
    });
    setShowReceipt(true);
    // Reset form
    setFormData({ name: '', email: '', courseId: '', paymentMethod: 'cash' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 print:hidden rtl:text-right">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {t('reception.registrationForm')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          {t('reception.registrationSubtitle')}
        </p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-100 dark:border-slate-800 shadow-soft overflow-hidden print:hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rtl:text-right">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 rtl:flex-row-reverse">
                <User size={16} />
                {t('reception.studentInfo', 'Student Information')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('auth.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none rtl:text-right"
                      placeholder={t('auth.placeholderName')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none rtl:text-right"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Course & Payment */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 rtl:flex-row-reverse">
                <BookOpen size={16} />
                {t('reception.enrollmentPayment', 'Enrollment & Payment')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reception.courseSelection')}
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <select
                      required
                      value={formData.courseId}
                      onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                      className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-neutral-900 dark:text-white rtl:text-right"
                    >
                      <option value="" className="text-neutral-500">{t('reception.selectCourse', 'Select a course...')}</option>
                      {mockCourses && mockCourses.length > 0 ? (
                        mockCourses.map(course => (
                          <option key={course.id} value={course.id} className="text-neutral-900 dark:text-slate-900">
                            {course.title} - {String(t('common.currency', { val: course.price }))}
                          </option>
                        ))
                      ) : (
                        <option disabled>{t('common.noData')}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reception.paymentMethod')}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['cash', 'card', 'bankTransfer'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: method})}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.paymentMethod === method 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                          : 'border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {t(`reception.${method}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-50 dark:border-slate-800">
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold shadow-glow hover:shadow-glow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 rtl:flex-row-reverse"
            >
              <CheckCircle2 size={20} />
              {t('reception.processRegistration')}
            </button>
          </div>
        </form>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
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
                  <div className="inline-block px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                    {t('reception.receipt.paymentSuccess', 'Payment Success')}
                  </div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.number')}</p>
                  <p className="font-bold text-neutral-900 dark:text-white">#{receiptData.receiptId}</p>
                </div>
              </div>

              <div className="py-6 border-y border-neutral-100 dark:border-slate-800 flex justify-between items-center rtl:flex-row-reverse">
                <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">{t('reception.receipt.title', 'Payment Receipt')}</h1>
                <div className="text-right rtl:text-left">
                   <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.dateIssued', 'Date Issued')}</p>
                   <p className="font-bold text-neutral-900 dark:text-white text-sm">{receiptData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 rtl:text-right">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.studentDetails', 'Student Details')}</p>
                    <p className="font-black text-neutral-900 dark:text-white text-lg">{receiptData.name}</p>
                    <p className="text-sm text-neutral-500">{receiptData.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('student.id')}</p>
                    <p className="font-black text-primary-600 text-xl tracking-wider">{receiptData.studentId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('auth.password', 'Password')}</p>
                    <p className="font-black text-neutral-900 dark:text-white">{receiptData.password}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-right rtl:text-left">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.enrolledCourse', 'Enrolled Course')}</p>
                    <p className="font-black text-neutral-900 dark:text-white">{receiptData.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.paymentMethod')}</p>
                    <p className="font-bold text-neutral-900 dark:text-white capitalize">{t(`reception.${receiptData.paymentMethod}`)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-slate-800/50 p-6 rounded-[2rem] flex justify-between items-center rtl:flex-row-reverse">
                <div className="rtl:text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('reception.receipt.totalPaid', 'Total Amount Paid')}</p>
                  <p className="text-neutral-500 text-xs italic">{t('reception.receipt.taxesIncl', 'All taxes included')}</p>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="text-4xl font-black text-primary-600 tracking-tighter">{String(t('common.currency', { val: receiptData.price }))}</p>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-dashed border-neutral-200 dark:border-slate-700 rtl:flex-row-reverse">
                <div className="space-y-1 rtl:text-right">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{t('reception.receipt.processedBy', 'Processed By')}</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{receiptData.receptionist}</p>
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

export default RegisterStudent;
