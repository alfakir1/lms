import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar,
  UserCheck,
  GraduationCap,
  CreditCard,
  FileText,
  Award
} from 'lucide-react';
import { mockUsers } from '../../utils/mockData';

const StudentsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const students = mockUsers.filter(u => 
    u.role === 'student' && 
    ((u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (u.student_id && u.student_id.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // ─── Print ID Card ────────────────────────────────────────────────
  const handlePrintIDCard = (student: any) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card – ${student.name}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', sans-serif; background: #f1f5f9;
                   display: flex; justify-content: center; align-items: center;
                   min-height: 100vh; padding: 20px; }
            .card {
              width: 380px; background: #fff;
              border-radius: 18px; overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,.15);
            }
            .card-top {
              background: linear-gradient(135deg, #1d4ed8 0%, #10b981 100%);
              padding: 24px 24px 16px; color: #fff;
            }
            .academy { font-size: 11px; font-weight: 900; letter-spacing: .2em;
                       text-transform: uppercase; opacity: .8; margin-bottom: 8px; }
            .card-title { font-size: 22px; font-weight: 900; letter-spacing: .05em; }
            .card-body { padding: 24px; }
            .avatar {
              width: 64px; height: 64px; border-radius: 50%;
              background: linear-gradient(135deg, #1d4ed8, #10b981);
              display: flex; align-items: center; justify-content: center;
              color: #fff; font-size: 28px; font-weight: 900;
              margin-bottom: 16px;
            }
            .name { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
            .role { font-size: 12px; color: #64748b; text-transform: uppercase;
                    letter-spacing: .1em; font-weight: 700; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-size: 10px; color: #94a3b8; text-transform: uppercase;
                     letter-spacing: .1em; font-weight: 700; }
            .value { font-size: 13px; font-weight: 800; color: #0f172a; }
            .id-badge {
              margin-top: 16px; background: #eff6ff; border: 2px solid #dbeafe;
              border-radius: 10px; padding: 10px 16px; text-align: center;
            }
            .id-badge .label { margin-bottom: 4px; }
            .id-badge .id-num { font-size: 22px; font-weight: 900; color: #1d4ed8;
                                letter-spacing: .15em; font-family: monospace; }
            @media print { body { background: #fff; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-top">
              <div class="academy">FOUR ACADEMY</div>
              <div class="card-title">Student ID Card</div>
            </div>
            <div class="card-body">
              <div class="avatar">${(student.name || 'S').charAt(0).toUpperCase()}</div>
              <div class="name">${student.name}</div>
              <div class="role">Student</div>
              <div class="row">
                <div><div class="label">Email</div><div class="value">${student.email}</div></div>
              </div>
              <div class="row">
                <div><div class="label">Join Date</div><div class="value">${new Date(student.created_at).toLocaleDateString('en-GB')}</div></div>
              </div>
              <div class="id-badge">
                <div class="label">Student ID</div>
                <div class="id-num">${student.student_id || 'N/A'}</div>
              </div>
            </div>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // ─── Print Grade Sheet ────────────────────────────────────────────
  const handlePrintGrades = (student: any) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Grades – ${student.name}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 50px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; align-items: flex-start;
                      border-bottom: 3px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 22px; font-weight: 900; color: #10b981; letter-spacing: .05em; }
            .title { font-size: 28px; font-weight: 900; color: #1d4ed8; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                         margin-bottom: 30px; background: #f8fafc; padding: 16px; border-radius: 10px; }
            .info-item .label { font-size: 10px; color: #94a3b8; text-transform: uppercase;
                                letter-spacing: .1em; font-weight: 700; }
            .info-item .value { font-size: 14px; font-weight: 800; }
            table { width: 100%; border-collapse: collapse; }
            thead tr { background: #1d4ed8; color: #fff; }
            th { padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase;
                 letter-spacing: .1em; font-weight: 700; }
            td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            tr:hover td { background: #f8fafc; }
            .total-row td { font-weight: 900; background: #eff6ff; color: #1d4ed8; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; padding-top: 20px;
                      border-top: 1px dashed #e2e8f0; font-size: 12px; color: #94a3b8; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">FOUR ACADEMY</div>
              <div class="title">Academic Grade Report</div>
              <div class="subtitle">Official academic record</div>
            </div>
            <div style="text-align:right; font-size:12px; color:#64748b;">
              <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
              <div style="margin-top:6px;">Document No: GR-${Date.now()}</div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Student Name</div>
              <div class="value">${student.name}</div>
            </div>
            <div class="info-item">
              <div class="label">Student ID</div>
              <div class="value" style="color:#1d4ed8;">${student.student_id || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Email</div>
              <div class="value">${student.email}</div>
            </div>
            <div class="info-item">
              <div class="label">Enrollment Date</div>
              <div class="value">${new Date(student.created_at).toLocaleDateString('en-GB')}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignments</th>
                <th>Quizzes</th>
                <th>Mid-Term</th>
                <th>Final Exam</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full-Stack Web Development</td>
                <td>18/20</td>
                <td>27/30</td>
                <td>43/50</td>
                <td>85/100</td>
                <td>173/200</td>
                <td style="font-weight:900; color:#10b981;">A</td>
              </tr>
              <tr>
                <td>UI/UX Design Fundamentals</td>
                <td>19/20</td>
                <td>28/30</td>
                <td>45/50</td>
                <td>90/100</td>
                <td>182/200</td>
                <td style="font-weight:900; color:#10b981;">A+</td>
              </tr>
              <tr class="total-row">
                <td colspan="5">Cumulative GPA</td>
                <td colspan="2">3.85 / 4.0</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <div>Issued by: Four Academy Administration</div>
            <div>This is an official document — Four Academy</div>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // ─── Print Certificate ────────────────────────────────────────────
  const handlePrintCertificate = (student: any) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate – ${student.name}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              background: #fff; display: flex; justify-content: center;
              align-items: center; min-height: 100vh; padding: 30px;
            }
            .cert {
              width: 900px; border: 12px solid #0f172a;
              padding: 60px; text-align: center; position: relative;
            }
            .cert::before {
              content: ''; position: absolute; inset: 8px;
              border: 2px solid #10b981; pointer-events: none;
            }
            .logo { font-size: 14px; font-weight: 900; letter-spacing: .3em;
                    color: #10b981; text-transform: uppercase; margin-bottom: 40px; }
            .presents { font-size: 16px; color: #64748b; margin-bottom: 20px; }
            .name {
              font-size: 52px; font-weight: 700; font-style: italic;
              color: #0f172a; border-bottom: 3px solid #10b981;
              display: inline-block; padding-bottom: 8px;
              margin-bottom: 30px; min-width: 60%;
            }
            .text { font-size: 18px; color: #475569; line-height: 1.8; margin-bottom: 40px; }
            .course { font-size: 28px; font-weight: 700; color: #1d4ed8; margin-bottom: 50px; }
            .badges { display: flex; justify-content: center; gap: 40px; margin-bottom: 60px; }
            .badge { text-align: center; }
            .badge .num { font-size: 28px; font-weight: 900; color: #0f172a; }
            .badge .lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase;
                          letter-spacing: .1em; font-weight: 700; }
            .footer {
              display: flex; justify-content: space-between; align-items: flex-end;
              border-top: 1px solid #e2e8f0; padding-top: 30px;
            }
            .sig { text-align: center; min-width: 180px; }
            .sig .line { height: 1px; background: #0f172a; margin-bottom: 8px; }
            .sig .role { font-size: 11px; color: #64748b; text-transform: uppercase;
                         letter-spacing: .1em; font-weight: 700; }
            .seal {
              width: 80px; height: 80px; border-radius: 50%;
              border: 3px solid #1d4ed8; display: flex; align-items: center;
              justify-content: center; font-size: 32px; font-weight: 900;
              color: #1d4ed8; font-family: sans-serif;
            }
            @media print { body { background: #fff; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="logo">✦ FOUR ACADEMY ✦</div>
            <div class="presents">This is to certify that</div>
            <div class="name">${student.name}</div>
            <p class="text">
              has successfully completed all required coursework, examinations,<br/>
              and assessments, demonstrating exceptional academic achievement in
            </p>
            <div class="course">Professional Development Program</div>
            <div class="badges">
              <div class="badge"><div class="num">A</div><div class="lbl">Final Grade</div></div>
              <div class="badge"><div class="num">3.85</div><div class="lbl">GPA</div></div>
              <div class="badge"><div class="num">${student.student_id || 'N/A'}</div><div class="lbl">Student ID</div></div>
            </div>
            <div class="footer">
              <div class="sig">
                <div class="line"></div>
                <div class="role">Course Instructor</div>
              </div>
              <div class="seal">4</div>
              <div class="sig">
                <div class="line"></div>
                <div class="role">Academy Director</div>
              </div>
            </div>
            <p style="font-size:11px; color:#94a3b8; margin-top:20px;">
              Issued on ${new Date().toLocaleDateString('en-GB')} — Certificate No. CERT-${Date.now()}
            </p>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rtl:flex-row-reverse">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {t('reception.studentManagement', 'Students Management')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('reception.managementSubtitle', 'Search students and print ID, grades, or certificate')}
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-neutral-100 dark:border-slate-800 shadow-soft">
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 bg-transparent outline-none text-sm w-64 rtl:text-right"
              placeholder="Search by name, email or ID..."
            />
          </div>
          <button className="p-2 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Filter size={18} className="text-neutral-500" />
          </button>
        </div>
      </header>

      {students.length === 0 && (
        <div className="text-center py-20 text-neutral-400">
          <UserCheck size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No students found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {students.map((student) => (
          <div 
            key={student.id} 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-neutral-100 dark:border-slate-800 shadow-soft hover:shadow-glow-sm transition-all group rtl:text-right"
          >
            {/* Student Info */}
            <div className="flex items-start justify-between mb-6 rtl:flex-row-reverse">
              <div className="flex items-center gap-4 rtl:flex-row-reverse">
                <div className="w-16 h-16 rounded-3xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-2xl shadow-inner shrink-0">
                  {student.name?.charAt(0)}
                </div>
                <div className="rtl:text-right">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 rtl:flex-row-reverse">
                    <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded font-bold">
                      {student.student_id || 'NO ID'}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <UserCheck size={12} className="text-emerald-500" />
                    {t('common.studentAccount', 'Student')}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <Mail size={16} className="text-primary-500 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <Calendar size={16} className="text-indigo-500 shrink-0" />
                <span>{t('common.joined', 'Joined')} {new Date(student.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 rtl:flex-row-reverse">
                <GraduationCap size={16} className="text-amber-500 shrink-0" />
                <span>2 {t('student.enrollments', 'Courses Enrolled')}</span>
              </div>
            </div>

            {/* Print Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handlePrintIDCard(student)}
                className="py-3 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 hover:text-white text-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard size={14} />
                ID Card
              </button>
              <button 
                onClick={() => handlePrintGrades(student)}
                className="py-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              >
                <FileText size={14} />
                Grades
              </button>
              <button 
                onClick={() => handlePrintCertificate(student)}
                className="col-span-2 py-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              >
                <Award size={14} />
                Print Certificate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsManagement;
