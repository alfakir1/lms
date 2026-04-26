import React, { useState } from 'react';
import { Star, Clock, Filter, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourses, useCreateCourse, useInstructors } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const CoursesList: React.FC = () => {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const { data: instructors } = useInstructors();
  const createMutation = useCreateCourse();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', status: 'draft', instructor_id: '' });

  if (isLoading) return <LoadingSpinner />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { ...formData, price: Number(formData.price), instructor_id: formData.instructor_id ? Number(formData.instructor_id) : undefined, status: formData.status as 'active' | 'draft' | 'archived' },
      { onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', price: '', status: 'draft', instructor_id: '' });
      }}
    );
  };

  const canManageCourses = user?.role === 'admin' || user?.role === 'instructor';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">جميع الكورسات</h1>
          <p className="text-slate-500">اكتشف مجموعتنا الواسعة من الكورسات التعليمية.</p>
        </div>
        <div className="flex gap-2">
          {canManageCourses && (
            <Button icon={<Plus className="w-4 h-4"/>} onClick={() => setIsModalOpen(true)}>
              إضافة كورس
            </Button>
          )}
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="بحث عن كورس..." className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses?.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="h-48 bg-slate-200 relative shrink-0">
              <img src={`https://picsum.photos/seed/${course.id}/400/300`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                كورس
              </div>
            </div>
            <div className="p-5 space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-4 h-4" />
                  <span>متاح دائماً</span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 flex-1">{course.title}</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=${course.instructor?.id || course.id}`} alt="instructor" />
                </div>
                <span className="text-xs text-slate-500 font-medium line-clamp-1">م. {course.instructor?.user?.name || 'غير محدد'}</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{course.price}$</span>
                <Link to={`/courses/${course.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors">عرض التفاصيل</Link>
              </div>
            </div>
          </motion.div>
        ))}
        {courses?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">لا توجد كورسات متاحة حالياً.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة كورس جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="عنوان الكورس" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الوصف</label>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl resize-none h-24 outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <Input label="السعر ($)" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          
          {user?.role === 'admin' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">المدرب المسؤول</label>
              <select 
                required
                className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.instructor_id}
                onChange={e => setFormData({...formData, instructor_id: e.target.value})}
              >
                <option value="">اختر المدرب...</option>
                {instructors?.map(inst => (
                  <option key={inst.id} value={inst.instructor?.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الحالة</label>
            <select 
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">مسودة</option>
              <option value="active">نشط</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="submit" loading={createMutation.isPending} className="flex-1">حفظ الكورس</Button>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoursesList;
