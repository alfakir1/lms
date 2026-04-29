import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Filter, Search, Plus, Calendar, Users, Edit2, Archive, BookOpen } from 'lucide-react';
import { useCourses, useCreateCourse, useInstructors, useUpdateCourse } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import api from '../api/client';

const CoursesList: React.FC = () => {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const { data: instructors } = useInstructors();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    status: 'draft', 
    instructor_id: '',
    is_instance: false,
    parent_id: '',
    group_name: '',
    duration_days: '',
    min_students: '',
    max_students: '',
    start_date: '',
    end_date: ''
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'archived'>('all');

  if (isLoading) return <LoadingSpinner />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      price: Number(formData.price), 
      instructor_id: formData.instructor_id ? Number(formData.instructor_id) : undefined, 
      status: formData.status as any,
      parent_id: formData.is_instance ? Number(formData.parent_id) : undefined,
      group_name: formData.is_instance ? formData.group_name : undefined,
      duration_days: formData.duration_days ? Number(formData.duration_days) : undefined,
      min_students: formData.min_students ? Number(formData.min_students) : undefined,
      max_students: formData.max_students ? Number(formData.max_students) : undefined,
    };

    if (isEditMode && selectedCourseId) {
        updateMutation.mutate({ id: selectedCourseId, data: payload }, {
            onSuccess: () => {
                setIsModalOpen(false);
                resetForm();
            }
        });
    } else {
        createMutation.mutate(payload, { 
            onSuccess: () => {
                setIsModalOpen(false);
                resetForm();
            }
        });
    }
  };

  const resetForm = () => {
      setFormData({ 
        title: '', description: '', price: '', status: 'draft', instructor_id: '', 
        is_instance: false, parent_id: '', group_name: '',
        duration_days: '', min_students: '', max_students: '', start_date: '', end_date: ''
      });
      setIsEditMode(false);
      setSelectedCourseId(null);
  };

  const handleEdit = (course: any) => {
      setFormData({
          ...course,
          price: course.price.toString(),
          instructor_id: course.instructor_id?.toString() || '',
          is_instance: !!course.parent_id,
          parent_id: course.parent_id?.toString() || '',
          group_name: course.group_name || '',
          duration_days: course.duration_days?.toString() || '',
          min_students: course.min_students?.toString() || '',
          max_students: course.max_students?.toString() || '',
          start_date: course.start_date || '',
          end_date: course.end_date || ''
      });
      setSelectedCourseId(course.id);
      setIsEditMode(true);
      setIsModalOpen(true);
  };

  const filteredCourses = courses?.filter(c => {
      if (activeFilter === 'all') return c.status !== 'archived' || user?.role === 'admin';
      return c.status === activeFilter;
  });

  const canAddCourse = user?.role === 'admin';
  const masterCourses = courses?.filter(c => !c.parent_id);

  const statusOptions = [
      { value: 'all', label: 'الكل' },
      { value: 'active', label: 'نشط' },
      { value: 'upcoming', label: 'قادم' },
      { value: 'completed', label: 'مكتمل' },
      { value: 'archived', label: 'مؤرشف' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الكورسات</h1>
          <p className="text-slate-500">تحكم كامل في المحتوى التعليمي والمجموعات التدريبية.</p>
        </div>
        <div className="flex gap-2">
          {canAddCourse && (
            <Button icon={<Plus className="w-4 h-4"/>} onClick={() => { resetForm(); setIsModalOpen(true); }}>
              إضافة كورس
            </Button>
          )}

          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="بحث عن كورس..." className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === opt.value
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses?.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col relative"
          >
            <div className="h-48 bg-slate-200 relative shrink-0">
              <img src={`https://picsum.photos/seed/${course.id}/400/300`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-primary shadow-sm uppercase">
                {course.status}
              </div>
              {user?.role === 'admin' && (
                  <button 
                    onClick={(e) => { e.preventDefault(); handleEdit(course); }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl text-slate-600 hover:text-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                      <Edit2 className="w-4 h-4" />
                  </button>
              )}
            </div>
            <div className="p-5 space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{course.start_date || 'غير محدد'}</span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 flex-1">{course.title} {course.group_name && <span className="text-primary">({course.group_name})</span>}</h3>
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-tight">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrollments?.length || 0} / {course.max_students || '∞'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_days || '--'} يوم</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{course.price}$</span>
                <Link to={`/courses/${course.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors">عرض التفاصيل</Link>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredCourses?.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">لا توجد كورسات في هذا التصنيف.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "تعديل الكورس" : "إضافة كورس أو مجموعة تعليمية"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {!isEditMode && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 mb-4">
                <input 
                  type="checkbox" 
                  id="is_instance" 
                  checked={formData.is_instance} 
                  onChange={e => setFormData({...formData, is_instance: e.target.checked})}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="is_instance" className="text-sm font-bold text-primary">هذه "مجموعة تعليمية" تابعة لكورس أساسي</label>
              </div>
          )}

          {formData.is_instance ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">الكورس الأساسي</label>
                <select 
                  required
                  disabled={isEditMode}
                  className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-right"
                  value={formData.parent_id}
                  onChange={e => {
                    const selected = masterCourses?.find(c => c.id === Number(e.target.value));
                    setFormData({
                      ...formData, 
                      parent_id: e.target.value,
                      title: selected?.title || '',
                      description: selected?.description || '',
                      price: selected?.price?.toString() || ''
                    });
                  }}
                >
                  <option value="">اختر الكورس الأساسي...</option>
                  {masterCourses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <Input label="اسم المجموعة (مثلاً: المجموعة الصباحية)" required value={formData.group_name} onChange={e => setFormData({...formData, group_name: e.target.value})} />
            </>
          ) : (
            <>
              <Input label="عنوان الكورس" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">الوصف</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl resize-none h-24 outline-none focus:ring-2 focus:ring-primary/20 text-right text-sm"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <Input label="السعر ($)" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4">
              <Input label="تاريخ البدء" type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              <Input label="تاريخ الانتهاء" type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-4">
              <Input label="المدة (أيام)" type="number" value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: e.target.value})} />
              <Input label="أقل عدد طلاب" type="number" value={formData.min_students} onChange={e => setFormData({...formData, min_students: e.target.value})} />
              <Input label="أقصى عدد طلاب" type="number" value={formData.max_students} onChange={e => setFormData({...formData, max_students: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">المدرب المسؤول</label>
            <select 
              required
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-right"
              value={formData.instructor_id}
              onChange={e => setFormData({...formData, instructor_id: e.target.value})}
            >
              <option value="">اختر المدرب...</option>
              {instructors?.filter(i => i.role === 'instructor').map(inst => (
                <option key={inst.id} value={inst.instructor?.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الحالة</label>
            <select 
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-right"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">مسودة</option>
              <option value="upcoming">قادم قريباً</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="archived">مؤرشف</option>
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

export default CoursesList;
