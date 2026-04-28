import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, BookOpen, CreditCard, Printer, CheckCircle, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { Course } from '../../types';

/* ─── Types ─── */
interface StudentForm { name: string; login_id: string; email: string; password: string; phone: string; address: string; }
interface RegistrationResult { student: any; payment: any; course: any; }

/* ─── Step indicator ─── */
const steps = ['بيانات الطالب', 'اختيار الكورس', 'تسجيل الدفع', 'الإيصال'];

/* ─── Receipt Component ─── */
const Receipt: React.FC<{ data: RegistrationResult }> = ({ data }) => {
  const handlePrint = () => window.print();
  const date = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString('ar-SA');

  return (
    <div className="space-y-6">
      <div id="receipt-area" className="bg-white border-2 border-slate-200 rounded-3xl p-8 max-w-2xl mx-auto print:border-0 print:shadow-none print:max-w-full print:rounded-none">
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30">
            <span className="text-white text-2xl font-black">4A</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">أكاديمية فور أيه</h1>
          <p className="text-slate-500 text-sm">إيصال تسجيل رسمي</p>
        </div>

        {/* Receipt Number */}
        <div className="flex justify-between items-center mb-6 bg-primary/5 rounded-2xl p-4">
          <div>
            <p className="text-xs text-slate-400">رقم الإيصال</p>
            <p className="text-lg font-black text-primary">{data.payment?.transaction_id || 'TXN-' + Date.now()}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400">التاريخ والوقت</p>
            <p className="text-sm font-bold text-slate-700">{date}</p>
            <p className="text-xs text-slate-500">{time}</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="space-y-3 mb-6">
          <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">بيانات الطالب</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'الاسم الكامل', value: data.student?.name },
              { label: 'معرف الطالب', value: data.student?.login_id },
              { label: 'البريد الإلكتروني', value: data.student?.email || '—' },
            ].map(row => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
                <p className="text-sm font-bold text-slate-800">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-3 mb-6">
          <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">الكورس المسجّل</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.course?.title}</p>
              <p className="text-sm text-slate-500">{data.course?.price}$ رسوم الكورس</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-3 mb-6">
          <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">تفاصيل الدفع</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'المبلغ المدفوع', value: `${data.payment?.amount}$` },
              { label: 'طريقة الدفع', value: data.payment?.payment_method || data.payment?.method },
              { label: 'الحالة', value: 'مكتمل ✓' },
            ].map(row => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
                <p className="text-sm font-bold text-slate-800">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-between items-center">
          <span className="text-lg font-black text-slate-900">الإجمالي المدفوع</span>
          <span className="text-2xl font-black text-primary">{data.payment?.amount}$</span>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 border-t border-slate-100 pt-4">
          شكراً لاختيارك أكاديمية فور أيه — هذا الإيصال يُعد وثيقة رسمية
        </p>
      </div>

      <div className="flex gap-3 justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
        >
          <Printer className="w-5 h-5" />
          طباعة الإيصال
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          تسجيل طالب جديد
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const StudentRegistration: React.FC = () => {
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const [studentForm, setStudentForm] = useState<StudentForm>({
    name: '', login_id: '', email: '', password: '', phone: '', address: '',
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', payment_method: 'نقد' });
  const [createdStudent, setCreatedStudent] = useState<any>(null);

  /* ─── Courses Query ─── */
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => (r.data as any).data || r.data),
  });

  /* ─── Step 1: Create Student ─── */
  const createStudentMutation = useMutation({
    mutationFn: (data: any) => api.post('/users', data).then(r => (r.data as any).data || r.data),
    onSuccess: (data) => {
      setCreatedStudent(data);
      qc.invalidateQueries({ queryKey: ['users'] });
      setStep(1);
      setError('');
    },
    onError: (e: any) => {
      const msg = e.response?.data?.message || JSON.stringify(e.response?.data?.errors || 'خطأ في إنشاء الطالب');
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  /* ─── Step 3: Create Payment (auto-enrolls) ─── */
  const createPaymentMutation = useMutation({
    mutationFn: (data: any) => api.post('/payments', data).then(r => (r.data as any).data || r.data),
    onSuccess: (payment) => {
      setResult({ student: createdStudent, payment, course: selectedCourse });
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
      setStep(3);
      setError('');
    },
    onError: (e: any) => {
      const msg = e.response?.data?.message || JSON.stringify(e.response?.data?.errors || 'خطأ في تسجيل الدفع');
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  /* ─── Handlers ─── */
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createStudentMutation.mutate({ ...studentForm, role: 'student' });
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setPaymentForm(prev => ({ ...prev, amount: String(course.price) }));
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !createdStudent?.student?.id) {
      setError('بيانات الطالب أو الكورس غير مكتملة');
      return;
    }
    setError('');
    createPaymentMutation.mutate({
      student_id: createdStudent.student.id,
      course_id: selectedCourse.id,
      amount: Number(paymentForm.amount),
      payment_method: paymentForm.payment_method,
      status: 'completed',
    });
  };

  const paymentMethods = ['نقد', 'بطاقة ائتمانية', 'تحويل بنكي', 'شيك'];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">تسجيل طالب جديد</h1>
        <p className="text-slate-500 mt-1">اتبع الخطوات لتسجيل الطالب وإصدار الإيصال</p>
      </div>

      {/* Step Indicator */}
      {step < 3 && (
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-primary' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Student Form ── */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <form onSubmit={handleStudentSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">بيانات الطالب</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'الاسم الكامل *', field: 'name', type: 'text', placeholder: 'أدخل الاسم الكامل' },
                  { label: 'معرف الدخول *', field: 'login_id', type: 'text', placeholder: 'مثال: std2025' },
                  { label: 'البريد الإلكتروني', field: 'email', type: 'email', placeholder: 'example@mail.com' },
                  { label: 'كلمة المرور *', field: 'password', type: 'password', placeholder: '••••••••' },
                  { label: 'رقم الهاتف', field: 'phone', type: 'tel', placeholder: '05xxxxxxxx' },
                  { label: 'العنوان', field: 'address', type: 'text', placeholder: 'المدينة، الحي' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      required={label.includes('*')}
                      placeholder={placeholder}
                      value={(studentForm as any)[field]}
                      onChange={e => setStudentForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
                      dir="rtl"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={createStudentMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-60">
                {createStudentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>التالي: اختيار الكورس</span><ChevronLeft className="w-5 h-5" /></>}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Step 1: Course Selection ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">اختيار الكورس</h2>
              </div>

              {coursesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12 text-slate-400">لا توجد كورسات متاحة حالياً</div>
              ) : (
                <div className="grid gap-3">
                  {courses.map(course => (
                    <button key={course.id} onClick={() => handleCourseSelect(course)}
                      className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-right group">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <BookOpen className="text-white w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{course.title}</p>
                        <p className="text-sm text-slate-500 truncate">{course.description || 'كورس متميز'}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-lg font-black text-primary">{course.price}$</p>
                        <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors mx-auto mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => setStep(0)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors">
                <ChevronRight className="w-4 h-4" /> العودة
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">تسجيل الدفع</h2>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">الطالب</span>
                  <span className="font-bold text-slate-900">{createdStudent?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">الكورس</span>
                  <span className="font-bold text-slate-900">{selectedCourse?.title}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                  <span className="text-slate-500">سعر الكورس</span>
                  <span className="font-black text-primary text-base">{selectedCourse?.price}$</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">المبلغ المدفوع *</label>
                <input type="number" required min="0"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
                  dir="rtl" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">طريقة الدفع *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {paymentMethods.map(m => (
                    <button key={m} type="button" onClick={() => setPaymentForm(prev => ({ ...prev, payment_method: m }))}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        paymentForm.payment_method === m ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors px-4 py-3">
                  <ChevronRight className="w-4 h-4" /> العودة
                </button>
                <button type="submit" disabled={createPaymentMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-colors disabled:opacity-60">
                  {createPaymentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /><span>تأكيد وإصدار الإيصال</span></>}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Step 3: Receipt ── */}
        {step === 3 && result && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">تم التسجيل بنجاح!</h2>
              <p className="text-slate-500 text-sm">تم إنشاء حساب الطالب وتسجيله في الكورس</p>
            </div>
            <Receipt data={result} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body > *:not(#receipt-root) { display: none !important; }
          #receipt-area { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentRegistration;
