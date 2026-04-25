import React, { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { courseService } from '../services/courseService';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ErrorMessage, EmptyState } from '../components/ui/Feedback';

const CourseCardSkeleton = () => (
  <Card className="animate-pulse flex flex-col h-full border-0 shadow-soft dark:bg-slate-900">
    <div className="h-48 bg-slate-200 dark:bg-slate-800" />
    <CardContent className="flex-1 flex flex-col p-6 space-y-4">
      <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    </CardContent>
  </Card>
);

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearch = useDeferredValue(submittedSearch);
  const perPage = 9;

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['courses', currentPage, perPage, deferredSearch],
    queryFn: () =>
      courseService.getAll({
        page: currentPage,
        per_page: perPage,
        search: deferredSearch || undefined,
      }),
  });

  const courses = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
    setSubmittedSearch(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header & Search */}
      <section className="bg-slate-900 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-secondary-900/40 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
            {t('courses.title')}
          </h1>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('courses.subtitle')}
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t('courses.search')}
                className="w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-md py-3.5 ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 text-white placeholder:text-slate-400 outline-none focus:border-primary-500 focus:bg-white/20 transition-all font-medium shadow-glass"
              />
            </div>
            <Button type="submit" isLoading={isRefetching} className="rounded-full px-8 h-[52px] text-base font-bold shadow-glow-primary">
              {t('common.search')}
            </Button>
          </form>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error ? (
          <ErrorMessage 
            title="Failed to load courses" 
            message="Please check your connection and try again." 
            onRetry={() => refetch()} 
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />)
                : courses.map((course) => {
                    const lectureCount = course.chapters?.reduce((count, chapter) => count + (chapter.lectures?.length || 0), 0) || 0;

                    return (
                      <Link key={course.id} to={`/courses/${course.id}`} className="group block h-full">
                        <Card className="h-full border-0 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                          {/* Image Area */}
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
                            <div className="absolute top-4 left-4 z-20">
                              <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-slate-900 dark:text-white shadow-sm uppercase tracking-wide">
                                {course.status}
                              </span>
                            </div>
                          </div>

                          <CardContent className="flex-1 flex flex-col p-6">
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                              {course.description || 'No description available for this course.'}
                            </p>

                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span className="truncate max-w-[120px]">{course.instructor?.user?.name || 'Expert'}</span>
                              </div>
                              <span className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                {lectureCount} lectures
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                              <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : t('common.free') || 'Free'}
                              </span>
                              <Button variant="outline" size="sm" className="font-semibold group-hover:bg-primary-50 group-hover:text-primary-700 dark:group-hover:bg-primary-900/20 dark:group-hover:text-primary-400 group-hover:border-primary-200 transition-colors">
                                {t('courses.viewDetails')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
            </div>

            {!isLoading && courses.length === 0 && (
              <EmptyState 
                title="No courses found" 
                description={submittedSearch ? `No results for "${submittedSearch}". Try a different search term.` : "There are currently no courses available."}
                action={submittedSearch ? <Button variant="outline" onClick={() => { setSearchInput(''); setSubmittedSearch(''); }}>Clear Search</Button> : undefined}
                icon={<Search className="h-8 w-8" />}
              />
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 h-10 w-10 p-0 flex items-center justify-center rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 p-0 flex items-center justify-center rounded-full font-bold ${page === currentPage ? 'shadow-glow-primary' : ''}`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 h-10 w-10 p-0 flex items-center justify-center rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Courses;
