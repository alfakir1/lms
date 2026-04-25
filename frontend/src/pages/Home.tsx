import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { Users, BookOpen, Star, ArrowRight, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ErrorMessage, LoadingSpinner } from '../components/ui/Feedback';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => courseService.getAll({ per_page: 3 }),
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary-500/30 transition-colors duration-300">
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 blur-[100px] rounded-full mix-blend-multiply animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            {t('home.hero.title')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
            <span className="text-gradient">Four Academy</span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-glow-primary hover:-translate-y-1 transition-transform">
                {t('home.enrollNow')}
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <PlayCircle className="ltr:mr-2 rtl:ml-2 h-5 w-5" />
                {t('home.exploreNew')}
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-20 pt-10 border-t border-slate-200/60 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-display font-bold">Google</div>
            <div className="text-2xl font-display font-bold">Microsoft</div>
            <div className="text-2xl font-display font-bold">Amazon</div>
            <div className="text-2xl font-display font-bold">Meta</div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative z-20 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                {t('home.featured.title')}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {t('home.featured.description')}
              </p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-bold group">
                {t('home.featured.viewAll')}
                <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner text={t('common.loading')} />
          ) : error ? (
            <ErrorMessage 
              title={t('common.noData')} 
              message={t('common.noData')}
              onRetry={() => refetch()} 
            />
          ) : data?.data && data.data.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.data.map((course: any) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group block h-full">
                  <Card className="h-full border-0 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-slate-950 overflow-hidden flex flex-col">
                    {/* Course Image Area */}
                    <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                      <img 
                        src={`https://source.unsplash.com/random/800x600?education,technology&sig=${course.id}`} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Course';
                        }}
                      />
                      <div className="absolute top-4 ltr:right-4 rtl:left-4 z-20">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-slate-900 dark:text-white shadow-sm">
                          {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : t('common.free') || 'Free'}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="flex-1 flex flex-col p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md text-xs font-bold tracking-wide uppercase">
                          {t('home.featured.title')}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                        {course.description || t('common.noData')}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                          <Users className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
                          <span>1.2k</span>
                        </div>
                        <div className="flex items-center text-amber-500 text-sm font-medium">
                          <Star className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5 fill-current" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">{t('common.noData')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-black text-primary-400 mb-2">50k+</div>
              <div className="text-slate-400 font-medium">{t('home.benefits.platform')}</div>
            </div>
            <div>
              <div className="text-4xl font-display font-black text-secondary-400 mb-2">200+</div>
              <div className="text-slate-400 font-medium">{t('home.benefits.instructors')}</div>
            </div>
            <div>
              <div className="text-4xl font-display font-black text-primary-400 mb-2">100%</div>
              <div className="text-slate-400 font-medium">{t('home.benefits.certificates')}</div>
            </div>
            <div>
              <div className="text-4xl font-display font-black text-secondary-400 mb-2">24/7</div>
              <div className="text-slate-400 font-medium">{t('home.benefits.tracking')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
