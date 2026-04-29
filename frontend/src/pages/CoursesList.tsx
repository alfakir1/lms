import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCourses, useCreateCourse, useInstructors } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLang } from '../context/LangContext';

const CoursesList: React.FC = () => {
  const { user } = useAuth();
  const { lang, t, dir } = useLang();
  const { data: courses, isLoading } = useCourses();
  const canAddCourse = user?.role === 'admin' || user?.role === 'super_admin';
  const { data: instructors } = useInstructors(canAddCourse);
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


  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar' ? 'استكشف الدورات' : 'Explore Courses'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {lang === 'ar' ? 'اكتشف مجموعتنا الواسعة من البرامج التعليمية المتقدمة.' : 'Discover our wide range of advanced educational programs.'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 lg:flex-none">
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-container transition-colors">search</span>
             <input 
               type="text" 
               placeholder={lang === 'ar' ? 'بحث عن دورة...' : 'Search for a course...'} 
               className="pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full lg:w-80 outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all text-sm font-medium"
             />
          </div>
          {canAddCourse && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-container text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>{lang === 'ar' ? 'إضافة دورة' : 'Add Course'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories / Filters Tab */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
         {['All', 'Development', 'Design', 'Business', 'Marketing'].map((cat, i) => (
           <button key={cat} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${i === 0 ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-primary-container/30'}`}>
             {cat}
           </button>
         ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses?.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-container/10 transition-all duration-500 flex flex-col h-full relative"
          >
            {/* Image/Badge Area */}
            <div className="h-56 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
               <img 
                 src={`https://picsum.photos/seed/${course.id}/600/400`} 
                 alt={course.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="absolute top-6 left-6 flex flex-col gap-2">
                 <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-primary-container border border-white/20 shadow-xl uppercase tracking-widest">
                   {course.status}
                 </span>
               </div>
               <div className="absolute bottom-6 right-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                  <Link to={`/courses/${course.id}`} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-container shadow-2xl">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
               </div>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1.5 text-amber-500">
                   <span className="material-symbols-outlined text-sm fill-icon">star</span>
                   <span className="text-xs font-black">4.9</span>
                 </div>
                 <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">schedule</span>
                   {lang === 'ar' ? 'متاح دائماً' : 'Lifetime Access'}
                 </div>
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary-container transition-colors line-clamp-2 leading-tight mb-4">
                {course.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                {course.description || (lang === 'ar' ? 'انضم إلينا لتعلم المهارات الأكثر طلباً في سوق العمل مع خبراء متخصصين.' : 'Join us to learn the most in-demand skills in the market with specialized experts.')}
              </p>

              {/* Footer Section */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden border border-slate-200 dark:border-white/10">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.user?.name || '')}&background=random`} alt="instructor" />
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'المدرب' : 'Instructor'}</p>
                     <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{course.instructor?.user?.name || 'Expert Trainer'}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-primary-container">${course.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {courses?.length === 0 && (
        <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
           <span className="material-symbols-outlined text-7xl text-slate-200 dark:text-white/5 mb-6">school</span>
           <p className="text-xl font-bold text-slate-400">{lang === 'ar' ? 'لا توجد دورات متاحة حالياً.' : 'No courses available right now.'}</p>
        </div>
      )}

      {/* Creation Modal - Simplified Design for speed */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
           <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 z-10 shadow-2xl relative">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">{lang === 'ar' ? 'إضافة دورة جديدة' : 'Add New Course'}</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">{lang === 'ar' ? 'عنوان الدورة' : 'Course Title'}</label>
                   <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-container/20" />
                </div>
                <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">{lang === 'ar' ? 'السعر ($)' : 'Price ($)'}</label>
                   <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-container/20" />
                </div>
                <button type="submit" disabled={createMutation.isPending} className="w-full bg-primary-container text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all">
                  {createMutation.isPending ? '...' : (lang === 'ar' ? 'حفظ الدورة' : 'Save Course')}
                </button>
             </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
