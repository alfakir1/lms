import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, Play, CheckCircle, Clock } from 'lucide-react';
import { enrollmentService } from '../../services/enrollmentService';
import type { EnrollmentWithCourse } from '../../services/enrollmentService';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/ui/Feedback';

const MyCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: enrollments, isLoading, error, refetch } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  const filteredEnrollments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return enrollments || [];
    return (enrollments || []).filter((e: EnrollmentWithCourse) => {
      const title = e.course?.title || '';
      const desc = e.course?.description || '';
      return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    });
  }, [enrollments, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorMessage 
            title="Failed to load courses" 
            message="We couldn't fetch your course list." 
            onRetry={() => refetch()} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Courses</h1>
          <p className="text-slate-600">Access your enrolled courses and track your progress.</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition outline-none"
            />
          </div>
        </div>

        {/* Course Grid */}
        {filteredEnrollments.length === 0 ? (
          <EmptyState 
            title={searchTerm ? 'No courses found' : 'No courses yet'}
            description={searchTerm ? 'Try a different search term.' : 'Enroll in a course to get started.'}
            action={
              !searchTerm ? (
                <Link to="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const progress = enrollment.progress_percent ?? 0;
              const isCompleted = progress === 100;
              const canAccess = enrollment.status === 'active' && enrollment.payment_status === 'paid';

              return (
                <Card key={enrollment.id} className="flex flex-col group hover:border-primary-200 hover:shadow-md transition">
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative p-6">
                    <BookOpen className="h-10 w-10 text-white/30 absolute right-4 bottom-4" />
                    <div className="text-white z-10 w-full">
                      <p className="text-lg font-bold line-clamp-2 leading-tight">{enrollment.course?.title}</p>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-500/20 text-secondary-300 text-xs font-bold rounded-full backdrop-blur-md border border-secondary-500/30">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white/90 text-xs font-bold rounded-full backdrop-blur-md border border-white/20">
                          <Clock className="h-3.5 w-3.5" />
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>

                  <CardContent className="flex-1 flex flex-col p-6">
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                      {enrollment.course?.description || 'No description available.'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-600">Progress</span>
                        <span className={isCompleted ? 'text-secondary-600' : 'text-primary-600'}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isCompleted ? 'bg-secondary-500' : 'bg-primary-500'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    {canAccess ? (
                      <Link to={`/student/courses/${enrollment.course_id}/learn`} className="block w-full">
                        <Button 
                          variant={isCompleted ? 'secondary' : 'primary'} 
                          className="w-full"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Pending Approval
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
