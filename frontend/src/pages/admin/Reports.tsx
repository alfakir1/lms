import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, PieChart, BarChart3, Download, Calendar, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Reports: React.FC = () => {
    const { data: reports, isLoading } = useQuery({
        queryKey: ['admin-reports'],
        queryFn: dashboardApi.getReports,
    });

    if (isLoading) return <LoadingSpinner />;

    const userStats = reports?.users || {};
    const courseStats = reports?.courses || {};
    const financialStats = reports?.financial || {};

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        if (!financialStats.recent_payments?.length) return;
        
        const headers = ['Student', 'Course', 'Amount', 'Date', 'Status'];
        const csvRows = [
            headers.join(','),
            ...financialStats.recent_payments.map((p: any) => [
                p.student?.user?.name,
                p.course?.title,
                p.amount,
                new Date(p.created_at).toLocaleDateString(),
                p.status
            ].join(','))
        ];
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center print-hide">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">التقارير والإحصائيات</h1>
                <div className="flex gap-3">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Printer className="w-4 h-4" /> طباعة التقرير
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Download className="w-4 h-4" /> تصدير CSV
                    </button>
                </div>
            </div>

            {/* Print Header (Only visible during print) */}
            <div className="hidden print:block text-center border-b-2 border-slate-200 pb-6 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">تقرير أداء الأكاديمية العام</h1>
                <p className="text-slate-500 mt-2">تاريخ الاستخراج: {new Date().toLocaleString('ar-SA')}</p>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Users className="text-primary w-5 h-5" /> توزيع المستخدمين
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'الطلاب', value: userStats.students, color: 'bg-primary' },
                            { label: 'المحاضرين', value: userStats.instructors, color: 'bg-amber-500' },
                            { label: 'الاستقبال', value: userStats.reception, color: 'bg-emerald-500' },
                            { label: 'المسؤولين', value: userStats.admins, color: 'bg-rose-500' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200">
                    <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                        <DollarSign className="text-primary w-5 h-5" /> إجمالي الإيرادات
                    </h2>
                    <p className="text-5xl font-black mb-2 tracking-tighter">${financialStats.total_revenue?.toLocaleString() || 0}</p>
                    <p className="text-slate-400 text-sm font-medium">إجمالي المبالغ المحصلة من عمليات التسجيل</p>
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-400">+15.4%</p>
                            <p className="text-xs text-slate-500">زيادة عن الشهر الماضي</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Course Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <BookOpen className="text-primary w-5 h-5" /> حالة الكورسات
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: 'كورسات نشطة', value: courseStats.active, total: courseStats.total, color: 'bg-emerald-500' },
                            { label: 'قادمة قريباً', value: courseStats.upcoming, total: courseStats.total, color: 'bg-amber-500' },
                            { label: 'مكتملة', value: courseStats.completed, total: courseStats.total, color: 'bg-primary' },
                            { label: 'مؤرشفة', value: courseStats.archived, total: courseStats.total, color: 'bg-slate-400' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-end mb-1.5">
                                    <p className="text-sm font-black text-slate-700">{item.label}</p>
                                    <p className="text-xs font-bold text-slate-500">{item.value} / {item.total}</p>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${item.color} transition-all duration-1000`} 
                                        style={{ width: `${(item.value / item.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <PieChart className="text-primary w-5 h-5" /> الإيرادات لكل كورس (أعلى 5)
                    </h2>
                    <div className="space-y-4">
                        {financialStats.revenue_by_course?.slice(0, 5).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 truncate">{item.title}</p>
                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5">
                                        <div className="h-full bg-primary/40" style={{ width: '60%' }} />
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-900">${item.total_revenue || 0}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Financial Transactions */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden break-inside-avoid">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <BarChart3 className="text-primary w-5 h-5" /> أحدث العمليات المالية
                    </h2>
                    <Calendar className="text-slate-400 w-5 h-5" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4">الطالب</th>
                                <th className="px-8 py-4">الكورس</th>
                                <th className="px-8 py-4">المبلغ</th>
                                <th className="px-8 py-4">التاريخ</th>
                                <th className="px-8 py-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {financialStats.recent_payments?.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-black text-slate-900">{p.student?.user?.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{p.student?.user?.email}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-slate-700">{p.course?.title}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-black text-primary">${p.amount}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-xs text-slate-500 font-medium">{new Date(p.created_at).toLocaleDateString('ar-SA')}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                                            p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {p.status === 'completed' ? 'مكتمل' : 'معلق'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media print {
                    .print-hide { display: none !important; }
                    body { background: white !important; }
                    .bg-slate-900 { background: #1e293b !important; color: white !important; }
                    .rounded-3xl { border-radius: 0.5rem !important; }
                    .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                    @page { size: A4; margin: 15mm; }
                    .break-inside-avoid { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

export default Reports;
