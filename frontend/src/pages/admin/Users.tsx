import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Trash2, UserPlus, FileText } from 'lucide-react';
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

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const filteredUsers = users?.filter((u: User) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles: UserRole[] = currentUser?.role === 'admin' 
    ? ['admin', 'instructor', 'student', 'reception'] 
    : ['student'];

  const handlePrintCard = (u: User) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>بطاقة تعريف - ${u.name}</title>
          <style>
            body { font-family: sans-serif; direction: rtl; display: flex; justify-content: center; padding-top: 50px; }
            .card { width: 350px; height: 200px; border: 2px solid #6366f1; border-radius: 15px; padding: 20px; position: relative; background: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
            .logo { color: #6366f1; font-weight: bold; font-size: 1.2rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
            .field { margin-bottom: 8px; font-size: 0.9rem; }
            .label { font-weight: bold; color: #64748b; margin-left: 5px; }
            .role { position: absolute; top: 20px; left: 20px; background: #6366f1; color: #fff; padding: 2px 10px; rounded-full; font-size: 0.7rem; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">أكاديمية فور أيه</div>
            <div class="role">${u.role.toUpperCase()}</div>
            <div class="field"><span class="label">الاسم:</span> ${u.name}</div>
            <div class="field"><span class="label">المعرف:</span> ${u.login_id}</div>
            <div class="field"><span class="label">البريد:</span> ${u.email}</div>
          </div>
          <script>window.print();</script>
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
          <p><strong>تاريخ الانضمام:</strong> ${new Date(u.created_at).toLocaleDateString('ar-SA')}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-right">
        <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
        {currentUser?.role === 'admin' && (
          <Button icon={<Plus className="w-4 h-4"/>} onClick={() => { setFormData({ role: roles[0] }); setIsModalOpen(true); }}>
            إضافة مستخدم
          </Button>
        )}
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
                <th className="px-6 py-4 font-semibold">البريد</th>
                <th className="px-6 py-4 font-semibold">الدور</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers?.map((u: User) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.login_id}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handlePrintCard(u)} title="طباعة الهوية" className="text-slate-400 hover:text-primary p-1.5 transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button onClick={() => handlePrintData(u)} title="طباعة البيانات" className="text-slate-400 hover:text-primary p-1.5 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                      {currentUser?.role === 'admin' && u.id !== currentUser.id && (
                        <button onClick={() => deleteMutation.mutate(u.id)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة مستخدم جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="الاسم الكامل" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="اسم الدخول (المعرف)" required value={formData.login_id || ''} onChange={e => setFormData({...formData, login_id: e.target.value})} />
          <Input label="البريد الإلكتروني" type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input label="كلمة المرور" type="password" required value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الدور</label>
            <select 
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl"
              value={formData.role || roles[0]}
              onChange={e => setFormData({...formData, role: e.target.value as any})}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="submit" loading={createMutation.isPending} className="flex-1">حفظ</Button>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
