import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Award, 
  Users, 
  BarChart, 
  ChevronRight, 
  Star, 
  Clock, 
  CheckCircle2,
  X
} from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const courses = [
    {
      id: 1,
      title: t('home.courses.fullStack.title', 'Full-Stack Web Development'),
      instructor: t('home.courses.fullStack.instructor', 'Dr. Sarah Ahmed'),
      price: "$199",
      duration: t('courses.duration_val', { val: 40 }),
      rating: 4.8,
      description: t('home.courses.fullStack.description', 'Learn how to build modern web applications using React, Node.js, and PostgreSQL.'),
      features: [
        t('home.courses.fullStack.features.0', 'Hands-on projects'),
        t('home.courses.fullStack.features.1', 'Certificate of completion'),
        t('home.courses.fullStack.features.2', 'Job placement assistance')
      ]
    },
    {
      id: 2,
      title: t('home.courses.dataScience.title', 'Data Science & AI'),
      instructor: t('home.courses.dataScience.instructor', 'Eng. Omar Khalid'),
      price: "$249",
      duration: t('courses.duration_val', { val: 60 }),
      rating: 4.9,
      description: t('home.courses.dataScience.description', 'Dive deep into the world of data science. Learn Python, Machine Learning, and Neural Networks.'),
      features: [
        t('home.courses.dataScience.features.0', 'Real-world datasets'),
        t('home.courses.dataScience.features.1', 'Mentorship sessions'),
        t('home.courses.dataScience.features.2', 'Access to AI labs')
      ]
    },
    {
      id: 3,
      title: t('home.courses.graphicDesign.title', 'Graphic Design Masterclass'),
      instructor: t('home.courses.graphicDesign.instructor', 'Mona Yassin'),
      price: "$149",
      duration: t('courses.duration_val', { val: 30 }),
      rating: 4.7,
      description: t('home.courses.graphicDesign.description', 'Master the art of visual communication. Learn Adobe Photoshop, Illustrator, and Figma.'),
      features: [
        t('home.courses.graphicDesign.features.0', 'Portfolio reviews'),
        t('home.courses.graphicDesign.features.1', 'Creative workshops'),
        t('home.courses.graphicDesign.features.2', 'Lifetime access')
      ]
    }
  ];

  const featuresList = [
    {
      id: 1,
      icon: <Award className="w-10 h-10" />,
      title: t('home.benefits.certificates'),
      details: t('home.benefits.certText')
    },
    {
      id: 2,
      icon: <Users className="w-10 h-10" />,
      title: t('home.benefits.instructors'),
      details: t('home.benefits.instructorsText')
    },
    {
      id: 3,
      icon: <BarChart className="w-10 h-10" />,
      title: t('home.benefits.tracking'),
      details: t('home.benefits.trackingText')
    },
    {
      id: 4,
      icon: <BookOpen className="w-10 h-10" />,
      title: t('home.benefits.platform'),
      details: t('home.benefits.platformText')
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
          >
            {t('home.hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto font-light"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 rtl:flex-row-reverse"
          >
            <button className="bg-accent text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all hover:scale-105 active:scale-95">
              {t('home.hero.browse')}
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
              {t('home.hero.demo', 'Watch Demo')}
            </button>
          </motion.div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute -top-24 -left-24 rtl:left-auto rtl:-right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 rtl:right-auto rtl:-left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-neutral-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">{t('home.featured.title')}</h2>
            <p className="text-neutral-600 dark:text-neutral-400">{t('home.featured.description')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-neutral-100 dark:border-slate-800"
                whileHover={{ y: -8 }}
              >
                <div className="h-48 bg-gradient-to-br from-primary to-secondary p-8 flex items-end">
                  <BookOpen className="w-12 h-12 text-white/40 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6 rtl:text-right">
                  <div className="flex items-center gap-2 mb-3 rtl:flex-row-reverse">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{course.rating}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{t('courses.instructor')}: {course.instructor}</p>
                  <div className="flex justify-between items-center border-t border-neutral-100 dark:border-slate-800 pt-4 rtl:flex-row-reverse">
                    <span className="text-xl font-bold text-primary dark:text-secondary">{course.price}</span>
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm rtl:flex-row-reverse">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedCourse && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedCourse(null)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-neutral-200 dark:border-slate-800 rtl:text-right"
                >
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="absolute top-6 right-6 rtl:right-auto rtl:left-6 p-2 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 transition-colors z-20"
                  >
                    <X className="w-6 h-6 dark:text-white" />
                  </button>
                  
                  <div className="h-48 bg-gradient-to-br from-primary to-secondary" />
                  
                  <div className="p-10 text-neutral-900 dark:text-white">
                    <h3 className="text-3xl font-bold mb-6">
                      {courses.find(c => c.id === selectedCourse)?.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                      {courses.find(c => c.id === selectedCourse)?.description}
                    </p>
                    <div className="grid gap-4 mb-10">
                      {courses.find(c => c.id === selectedCourse)?.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 text-neutral-800 dark:text-neutral-200 rtl:flex-row-reverse">
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98]">
                      {t('home.enrollNow')} - {courses.find(c => c.id === selectedCourse)?.price}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 bg-background dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">{t('home.instituteFeatures')}</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('home.benefits.description', 'Discover why thousands of students choose Four Academy for their professional development.')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 rtl:flex-row-reverse">
            {featuresList.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                className={`relative p-8 rounded-3xl border cursor-pointer transition-all duration-300 overflow-hidden rtl:text-right ${
                  selectedFeature === feature.id 
                  ? 'bg-secondary border-secondary shadow-xl scale-105 ring-4 ring-secondary/20' 
                  : 'bg-background dark:bg-slate-800 border-neutral-100 dark:border-slate-700 hover:border-secondary/50'
                }`}
              >
                <div className={`mb-6 transition-colors duration-300 ${
                  selectedFeature === feature.id ? 'text-white' : 'text-secondary dark:text-primary'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  selectedFeature === feature.id ? 'text-white' : 'text-neutral-900 dark:text-white'
                }`}>
                  {feature.title}
                </h3>
                
                <div className={`transition-all duration-300 overflow-hidden ${
                  selectedFeature === feature.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-white/90 text-sm leading-relaxed mt-2">
                    {feature.details}
                  </p>
                </div>

                {!selectedFeature && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-secondary dark:text-primary group rtl:flex-row-reverse">
                    {t('common.learnMore', 'LEARN MORE')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;