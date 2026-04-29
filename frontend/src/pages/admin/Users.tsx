import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import api from '../../api/client';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Trash2, UserPlus, FileText, Edit2, ShieldAlert, ShieldCheck, DollarSign, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => usersApi.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

  const filteredUsers = users?.filter((u: User) => 
    (selectedRole === 'all' || u.role === selectedRole) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const roleTabs: { id: UserRole | 'all'; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'student', label: 'الطلاب' },
    { id: 'instructor', label: 'المحاضرين' },
    { id: 'reception', label: 'الاستقبال' },
    { id: 'admin', label: 'المسؤولين' },
  ];

  const roles: UserRole[] = currentUser?.role === 'admin' 
    ? ['admin', 'instructor', 'student', 'reception'] 
    : ['student'];

  const handlePrintCard = (u: User) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const role = u.role || 'student';
    const isStudent = role === 'student';
    const studentId = String(u.id).padStart(6, '0');
    const initials = u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

    // Design Tokens
    const theme = isStudent ? {
      primary: 'linear-gradient(135deg, #0a1f5c 0%, #1e3a8a 45%, #2563eb 100%)',
      secondary: 'linear-gradient(135deg, #0a1f5c 0%, #1e40af 100%)',
      logo: '4A',
      subtitle: 'Excellence in Education',
      badge: 'Student ID Card',
      backBadge: 'STUDENT',
      accent: '#2563eb'
    } : {
      primary: 'linear-gradient(135deg, #111827 0%, #1f2937 45%, #374151 100%)',
      secondary: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
      logo: 'EA',
      subtitle: 'Employee Identification',
      badge: 'Staff ID',
      backBadge: 'EMPLOYEE',
      accent: '#06b6d4' // Cyan accent for Staff
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isStudent ? 'Student' : 'Staff'} ID - ${u.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            
            body { 
              margin: 0; 
              padding: 0; 
              background-color: #f3f4f6;
              font-family: 'Inter', sans-serif;
            }

            @media print {
              body { background-color: white; padding: 0; }
              .page { 
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                page-break-after: always;
              }
              .card { box-shadow: none !important; border: 0.1mm solid #e5e7eb; }
              @page { size: A4 portrait; margin: 0; }
            }

            /* Preview mode styling */
            .page {
              width: 100%;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px 0;
            }

            .card {
              width: 85.6mm;
              height: 54mm;
              background-color: #ffffff;
              border-radius: 3.5mm;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              display: flex;
              flex-direction: column;
              position: relative;
              background: #fff;
            }

            /* --- FRONT STYLES --- */
            .header {
              background: ${theme.primary};
              height: 14mm;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 4mm;
              color: white;
              flex-shrink: 0;
              position: relative;
              overflow: hidden;
            }
            .header-decor {
              position: absolute;
              right: -5mm;
              top: -5mm;
              width: 20mm;
              height: 20mm;
              border-radius: 50%;
              background: rgba(255,255,255,0.05);
            }
            .logo-circle { 
              width: 9mm; 
              height: 9mm; 
              background: rgba(255,255,255,0.15); 
              border: 0.4mm solid rgba(255,255,255,0.3); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: 900; 
              font-size: 3.5mm;
              z-index: 1;
              ${!isStudent ? 'color: #06b6d4;' : ''}
            }
            .header-text { z-index: 1; }
            .header-text h1 { margin: 0; font-size: 3.2mm; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
            .header-text p { margin: 0; font-size: 1.6mm; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.8px; }
            .header-badge { 
              background: rgba(255,255,255,0.12); 
              border: 0.2mm solid rgba(255,255,255,0.25); 
              border-radius: 1.5mm; 
              padding: 1mm 2.5mm; 
              font-size: 1.6mm; 
              font-weight: 700; 
              text-transform: uppercase;
              z-index: 1;
              ${!isStudent ? 'color: #06b6d4;' : 'color: #bfdbfe;'}
            }
            
            .card-body { flex: 1; display: flex; padding: 3.5mm 4mm; gap: 4mm; position: relative; overflow: hidden; }
            .watermark { 
              position: absolute; 
              right: 2mm; 
              top: 0mm; 
              font-size: 20mm; 
              font-weight: 900; 
              color: ${isStudent ? 'rgba(30,58,138,0.04)' : 'rgba(17,24,39,0.04)'}; 
              pointer-events: none; 
              line-height: 1;
            }
            .photo-section { 
              width: 21mm; 
              height: 21mm; 
              border-radius: 2.5mm; 
              background: ${isStudent ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'linear-gradient(135deg, #111827, #374151)'}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 8mm; 
              font-weight: 900; 
              border: 0.8mm solid #ffffff; 
              box-shadow: 0 2mm 5mm rgba(0,0,0,0.12); 
              flex-shrink: 0; 
            }
            .student-name { 
              font-size: 4.8mm; 
              font-weight: 900; 
              color: ${isStudent ? '#0a1f5c' : '#111827'}; 
              margin: 0 0 1.8mm 0; 
              text-transform: uppercase; 
              line-height: 1.1;
            }
            .info-item { display: flex; align-items: center; gap: 1.5mm; margin-bottom: 1mm; color: #4b5563; font-size: 2.1mm; }
            .info-item strong { color: #111827; }
            
            .footer { 
              height: 12.5mm; 
              border-top: 0.1mm solid #f3f4f6; 
              padding: 0 4mm; 
              display: flex; 
              align-items: center; 
              justify-content: space-between; 
              background: #fff;
            }
            .id-group h2 { margin: 0; font-size: 3.5mm; font-weight: 900; color: ${isStudent ? '#0a1f5c' : '#111827'}; letter-spacing: 1.5px; font-family: monospace; }
            .id-label { font-size: 1.5mm; color: #9ca3af; text-transform: uppercase; margin-bottom: 0.5mm; letter-spacing: 0.5px; }
            
            .status-badge { 
              background-color: #dcfce7; 
              color: #15803d; 
              border: 0.2mm solid #86efac; 
              border-radius: 4mm; 
              padding: 0.8mm 2.5mm; 
              font-size: 2.1mm; 
              font-weight: 800; 
              text-transform: uppercase;
            }
            .bottom-strip { height: 1.5mm; background: ${theme.primary}; }

            /* --- BACK STYLES --- */
            .card.back {
              background: ${theme.secondary};
              color: white;
              padding: 4.5mm;
              display: flex;
              flex-direction: row;
              box-sizing: border-box;
            }
            .back-watermark {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: 35mm;
              font-weight: 900;
              color: rgba(255,255,255,0.055);
              pointer-events: none;
              letter-spacing: -2mm;
            }
            .back-content { display: flex; width: 100%; height: 100%; position: relative; z-index: 2; }
            .back-left { flex: 1.2; display: flex; flexDirection: column; justify-content: space-between; border-right: 0.2mm solid rgba(255,255,255,0.15); padding-right: 3.5mm; }
            .back-right { flex: 1; padding-left: 3.5mm; display: flex; flexDirection: column; justify-content: space-between; text-align: right; }
            
            .back-title { font-size: 3.2mm; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5mm; letter-spacing: 0.5px; }
            .contact-info { font-size: 2.1mm; color: rgba(255,255,255,0.85); margin-bottom: 1.2mm; display: flex; align-items: center; gap: 1.5mm; }
            
            .back-badge {
              display: inline-block;
              background: rgba(255,255,255,0.12);
              border: 0.2mm solid rgba(255,255,255,0.3);
              border-radius: 1.5mm;
              padding: 1mm 2.5mm;
              font-size: 2.1mm;
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 2.5mm;
              color: ${!isStudent ? '#06b6d4' : '#bfdbfe'};
            }
            .property-text { font-size: 1.9mm; line-height: 1.5; color: rgba(255,255,255,0.75); }
            .qr-placeholder { width: 13mm; height: 13mm; background: white; border-radius: 1.5mm; align-self: flex-end; display: flex; align-items: center; justify-content: center; padding: 1.2mm; }
            .signature-line { width: 32mm; height: 0.2mm; background: rgba(255,255,255,0.4); margin-bottom: 1.2mm; }
            .signature-label { font-size: 1.6mm; text-transform: uppercase; color: rgba(255,255,255,0.5); letter-spacing: 0.5px; }

          </style>
        </head>
        <body>
          <!-- PAGE 1: FRONT -->
          <div class="page">
            <div class="card front">
              <div class="header">
                <div class="header-decor"></div>
                <div class="header-logo-group">
                  <div class="logo-circle">${theme.logo}</div>
                  <div class="header-text">
                    <h1>Four A Academy</h1>
                    <p>${theme.subtitle}</p>
                  </div>
                </div>
                <div class="header-badge">${theme.badge}</div>
              </div>

              <div class="card-body">
                <div class="watermark">${theme.logo}</div>
                <div class="photo-section">${initials}</div>
                <div class="info-section">
                  <div class="student-name">${u.name}</div>
                  <div class="info-item"><span>✉</span> <span>${u.email}</span></div>
                  ${isStudent ? `
                    <div class="info-item"><span>🎓</span> <strong>Program:</strong> <span>General Program</span></div>
                    <div class="info-item"><span>📊</span> <strong>Level:</strong> <span>Standard Level</span></div>
                  ` : `
                    <div class="info-item"><span>🏢</span> <strong>Dept:</strong> <span>Administration</span></div>
                    <div class="info-item"><span>💼</span> <strong>Pos:</strong> <span>Staff Member</span></div>
                  `}
                </div>
              </div>

              <div class="footer">
                <div class="id-group">
                  <div class="id-label">${isStudent ? 'Student' : 'Employee'} ID</div>
                  <h2>${studentId}</h2>
                </div>
                <div class="issue-group" style="text-align: center;">
                  <div class="id-label">Issue Date</div>
                  <span style="font-size: 2.5mm; font-weight: 700; color: #374151;">${issueDate}</span>
                </div>
                <div class="status-badge">ACTIVE</div>
              </div>
              <div class="bottom-strip"></div>
            </div>
          </div>

          <!-- PAGE 2: BACK -->
          <div class="page">
            <div class="card back">
              <div class="back-watermark">${theme.logo}</div>
              <div class="back-content">
                <div class="back-left" style="display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div class="back-title">Four A Academy</div>
                    <div class="contact-info">📍 Riyadh, Saudi Arabia</div>
                    <div class="contact-info">🌐 www.foura-academy.com</div>
                    <div class="contact-info">📞 +966 50 123 4567</div>
                  </div>
                  
                  <div>
                    <div class="signature-line"></div>
                    <div class="signature-label">Authorized Signature</div>
                  </div>
                </div>

                <div class="back-right" style="display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div class="back-badge">${theme.backBadge}</div>
                    <div class="property-text">
                      This card is the property of Four A Academy
                      and must be carried at all times.
                      If found, please return to the academy administration.
                    </div>
                  </div>

                  <div class="qr-placeholder">
                    <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
                      <rect x="10" y="10" width="80" height="80" fill="none" stroke="${isStudent ? '#0a1f5c' : '#111827'}" stroke-width="5" />
                      <rect x="25" y="25" width="20" height="20" fill="${isStudent ? '#0a1f5c' : '#111827'}" />
                      <rect x="55" y="25" width="20" height="20" fill="${isStudent ? '#0a1f5c' : '#111827'}" />
                      <rect x="25" y="55" width="20" height="20" fill="${isStudent ? '#0a1f5c' : '#111827'}" />
                      <rect x="55" y="55" width="20" height="20" fill="${isStudent ? '#0a1f5c' : '#111827'}" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintData = (u: User) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>بيانات المستخدم - ${u.name}</title></head>
        <body style="font-family: sans-serif; direction: rtl; padding: 40px;">
          <h1>بيانات المستخدم</h1>
          <hr/>
          <p><strong>الاسم:</strong> ${u.name}</p>
          <p><strong>المعرف الشخصي:</strong> ${u.login_id}</p>
          <p><strong>البريد الإلكتروني:</strong> ${u.email}</p>
          <p><strong>الدور في النظام:</strong> ${u.role}</p>
          <p><strong>الحالة:</strong> ${u.is_active ? 'نشط' : 'معطل'}</p>
          <p><strong>تاريخ الانضمام:</strong> ${new Date(u.created_at).toLocaleDateString('ar-SA')}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAcademicReport = async (u: User) => {
    try {
      const { data: res } = await api.get(`/users/${u.id}/academic-report`);
      const d = res.data;
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const attendancePercent = d.attendance.total > 0 
        ? Math.round((d.attendance.present / d.attendance.total) * 100) 
        : 100;

      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>التقرير الأكاديمي - ${u.name}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #6366f1; }
              .section { margin-bottom: 30px; }
              .section-title { font-weight: 800; font-size: 1.2rem; border-right: 4px solid #6366f1; padding-right: 10px; margin-bottom: 15px; color: #334155; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .info-box { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
              .label { font-weight: bold; color: #64748b; font-size: 0.85rem; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
              th { background: #f1f5f9; color: #475569; font-size: 0.9rem; }
              .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; }
              .badge-primary { background: #e0e7ff; color: #3730a3; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; font-size: 0.9rem; }
              .signature { width: 150px; border-top: 1px solid #94a3b8; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>أكاديمية فور أيه للتدريب المهني</h1>
              <p>تقرير السجل الأكاديمي للطلاب</p>
            </div>

            <div class="section">
              <div class="section-title">معلومات الطالب</div>
              <div class="grid">
                <div class="info-box">
                  <div class="label">اسم الطالب</div>
                  <div>${u.name}</div>
                </div>
                <div class="info-box">
                  <div class="label">الرقم التعريفي (ID)</div>
                  <div>${u.login_id}</div>
                </div>
                <div class="info-box">
                  <div class="label">تاريخ التسجيل</div>
                  <div>${new Date(u.created_at).toLocaleDateString('ar-SA')}</div>
                </div>
                <div class="info-box">
                  <div class="label">نسبة الحضور</div>
                  <div>${attendancePercent}% (${d.attendance.present} من أصل ${d.attendance.total})</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">الدورات التدريبية والنتائج</div>
              <table>
                <thead>
                  <tr>
                    <th>اسم الدورة</th>
                    <th>تاريخ التسجيل</th>
                    <th>الحالة</th>
                    <th>الدرجة</th>
                    <th>التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.enrollments.map((e: any) => {
                    const grade = d.grades.find((g: any) => g.course_id === e.course_id);
                    return `
                      <tr>
                        <td>${e.course?.title}</td>
                        <td>${new Date(e.created_at).toLocaleDateString('ar-SA')}</td>
                        <td><span class="badge badge-primary">${e.status}</span></td>
                        <td>${grade ? grade.grade + '%' : '--'}</td>
                        <td>${grade ? (grade.grade >= 50 ? 'ناجح' : 'راسب') : '--'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            ${d.certificates.length > 0 ? `
              <div class="section">
                <div class="section-title">الشهادات الممنوحة</div>
                <ul>
                  ${d.certificates.map((c: any) => `<li>شهادة إتمام كورس: ${c.course?.title} - بتوقيت ${new Date(c.issued_at).toLocaleDateString('ar-SA')}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <div class="footer">
              <div class="signature">ختم الأكاديمية</div>
              <div class="signature">توقيع المدير الأكاديمي</div>
            </div>

            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert('فشل تحميل التقرير الأكاديمي');
    }
  };

  const handleFinancialStatement = async (u: User) => {
    try {
      const { data: res } = await api.get(`/users/${u.id}/financial-statement`);
      const d = res.data;
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>كشف حساب مالي - ${u.name}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #d97706; }
              .section { margin-bottom: 30px; }
              .section-title { font-weight: 800; font-size: 1.2rem; border-right: 4px solid #f59e0b; padding-right: 10px; margin-bottom: 15px; color: #334155; }
              .summary-grid { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .summary-box { padding: 20px; border-radius: 15px; text-align: center; }
              .box-blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
              .box-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
              .box-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
              .box-val { font-size: 1.8rem; font-weight: 900; }
              .box-lab { font-size: 0.8rem; font-weight: bold; text-transform: uppercase; opacity: 0.8; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
              th { background: #f8fafc; color: #475569; }
              .total-row { background: #f1f5f9; font-weight: bold; }
              .footer { margin-top: 50px; text-align: left; font-size: 0.8rem; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>كشف الحساب المالي للطالب</h1>
              <p>${u.name} | ${u.login_id}</p>
            </div>

            <div class="summary-grid">
              <div class="summary-box box-blue">
                <div class="box-lab">إجمالي المستحق</div>
                <div class="box-val">$${d.summary.total_due}</div>
              </div>
              <div class="summary-box box-green">
                <div class="box-lab">إجمالي المسدد</div>
                <div class="box-val">$${d.summary.total_paid}</div>
              </div>
              <div class="summary-box box-amber">
                <div class="box-lab">المبلغ المتبقي</div>
                <div class="box-val">$${d.summary.balance}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">تفاصيل الرسوم الدراسية</div>
              <table>
                <thead>
                  <tr>
                    <th>اسم الدورة</th>
                    <th>تاريخ التسجيل</th>
                    <th>السعر المستحق</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.enrollments.map((e: any) => `
                    <tr>
                      <td>${e.course?.title}</td>
                      <td>${new Date(e.created_at).toLocaleDateString('ar-SA')}</td>
                      <td>$${e.course?.price || 0}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="2">الإجمالي المستحق</td>
                    <td>$${d.summary.total_due}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">سجل المدفوعات</div>
              <table>
                <thead>
                  <tr>
                    <th>تاريخ العملية</th>
                    <th>رقم العملية</th>
                    <th>الوسيلة</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.payments.map((p: any) => `
                    <tr>
                      <td>${new Date(p.created_at).toLocaleDateString('ar-SA')}</td>
                      <td>${p.transaction_id || '--'}</td>
                      <td>${p.method}</td>
                      <td>$${p.amount}</td>
                      <td>${p.status === 'completed' ? 'مقبول' : 'معلق'}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="3">إجمالي المسدد الفعلي</td>
                    <td>$${d.summary.total_paid}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              تم استخراج هذا الكشف آلياً بتاريخ ${new Date().toLocaleString('ar-SA')}
            </div>

            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert('فشل تحميل كشف الحساب المالي');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && formData.id) {
        updateMutation.mutate({ id: formData.id, data: formData });
    } else {
        createMutation.mutate(formData);
    }
  };

  const handleEdit = (u: User) => {
      setFormData(u);
      setIsEditMode(true);
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setFormData({ role: 'student' });
      setIsEditMode(false);
      setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-right">
        <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
        {currentUser?.role === 'admin' && (
          <Button icon={<Plus className="w-4 h-4"/>} onClick={handleCreate}>
            إضافة مستخدم
          </Button>
        )}
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {roleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedRole === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="mb-6 relative max-w-md mr-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو البريد..." 
            className="w-full pr-10 pl-4 py-2 border rounded-xl text-right outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">الاسم</th>
                <th className="px-6 py-4 font-semibold">المعرف</th>
                <th className="px-6 py-4 font-semibold">الدور</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers?.map((u: User) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{u.login_id}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase">
                      {u.role === 'admin' ? 'مسؤول' : u.role === 'instructor' ? 'محاضر' : u.role === 'student' ? 'طالب' : 'استقبال'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => toggleStatusMutation.mutate({ id: u.id, is_active: !u.is_active })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${
                            u.is_active 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                    >
                        {u.is_active ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {u.is_active ? 'نشط' : 'معطل'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(u)} title="تعديل" className="text-slate-400 hover:text-primary p-1.5 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handlePrintCard(u)} title="طباعة الهوية" className="text-slate-400 hover:text-primary p-1.5 transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button onClick={() => handlePrintData(u)} title="طباعة البيانات" className="text-slate-400 hover:text-primary p-1.5 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                      {u.role === 'student' && (
                        <>
                          <button onClick={() => handleAcademicReport(u)} title="التقرير الأكاديمي" className="text-slate-400 hover:text-emerald-500 p-1.5 transition-colors">
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleFinancialStatement(u)} title="كشف الحساب المالي" className="text-slate-400 hover:text-amber-500 p-1.5 transition-colors">
                            <DollarSign className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {currentUser?.role === 'admin' && u.id !== currentUser.id && (
                        <button onClick={() => { if(window.confirm('هل أنت متأكد؟')) deleteMutation.mutate(u.id) }} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="الاسم الكامل" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="اسم الدخول (المعرف)" required value={formData.login_id || ''} onChange={e => setFormData({...formData, login_id: e.target.value})} />
          <Input label="البريد الإلكتروني" type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input label={isEditMode ? "كلمة المرور (اتركها فارغة للتجاهل)" : "كلمة المرور"} type="password" required={!isEditMode} value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الدور</label>
            <select 
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl"
              value={formData.role || roles[0]}
              onChange={e => setFormData({...formData, role: e.target.value as any})}
            >
              {roles.map((r: UserRole) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending} className="flex-1">حفظ</Button>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
