import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { attendanceService } from '../../services/attendanceService';
import { 
  QrCode, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  StopCircle, 
  Loader2,
  ChevronRight,
  FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const InstructorAttendance: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [activeSession, setActiveSession] = useState<any>(null);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: coursesData } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => courseService.getAll(),
  });
  const courses = coursesData?.data || [];

  const { data: reportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['attendance-report', activeSession?.id],
    queryFn: () => attendanceService.getSessionReport(activeSession.id),
    enabled: !!activeSession,
    refetchInterval: activeSession ? 5000 : false, // Poll for live updates
  });

  const startSessionMutation = useMutation({
    mutationFn: (courseId: string) => attendanceService.startSession(courseId),
    onSuccess: (data: any) => {
      showSuccess('Attendance session started');
      setActiveSession(data.session);
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to start session');
    },
  });

  const closeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => attendanceService.closeSession(sessionId),
    onSuccess: () => {
      showSuccess('Attendance session closed');
      setActiveSession(null);
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to close session');
    },
  });

  const handleStartSession = () => {
    if (!selectedCourseId) return;
    startSessionMutation.mutate(selectedCourseId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <QrCode className="text-primary-600 h-8 w-8" />
              Attendance Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Start sessions and track student presence in real-time.
            </p>
          </div>
        </div>

        {!activeSession ? (
          <Card className="dark:bg-slate-900 mb-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <CardContent className="p-8">
              <div className="max-w-xl mx-auto text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Start a New Session</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                  Select a course to begin the attendance tracking. A dynamic QR code will be generated for students to scan.
                </p>
                
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Course</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                    >
                      <option value="">-- Choose Course --</option>
                      {courses.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    onClick={handleStartSession} 
                    className="w-full h-12 text-lg"
                    disabled={!selectedCourseId || startSessionMutation.isPending}
                    isLoading={startSessionMutation.isPending}
                  >
                    Launch Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="dark:bg-slate-900 border-primary-200 dark:border-primary-800 shadow-glow-primary overflow-hidden">
                <div className="bg-primary-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-wider opacity-80">Live Session</span>
                    <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Recording
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{activeSession.course?.title || 'Course Session'}</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Clock className="h-5 w-5 text-primary-500" />
                      <span className="text-sm">Started at {new Date(activeSession.start_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Users className="h-5 w-5 text-primary-500" />
                      <span className="text-sm">{reportData?.records?.length || 0} Students Checked In</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center mb-6">
                    <div className="bg-white p-4 rounded-xl inline-block shadow-sm mb-4">
                       {reportData?.session?.active_token ? (
                         <QRCodeSVG 
                            value={reportData.session.active_token.token} 
                            size={160}
                            level="H"
                            includeMargin={false}
                         />
                       ) : (
                         <div className="w-40 h-40 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-200">
                            <Clock className="h-10 w-10 text-slate-300 animate-pulse" />
                         </div>
                       )}
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {reportData?.session?.active_token ? 'Scan Now' : 'Waiting for student'}
                    </p>
                  </div>

                  <Button 
                    variant="outline"
                    onClick={() => closeSessionMutation.mutate(activeSession.id)}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    isLoading={closeSessionMutation.isPending}
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Close Session
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="dark:bg-slate-900 border-0 shadow-soft h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Records</h3>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Export
                       </Button>
                    </div>
                  </div>

                  {isLoadingReport ? (
                    <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 text-primary-600 animate-spin" /></div>
                  ) : reportData?.records?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {reportData.records.map((record: any) => (
                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                    {record.student?.user?.name?.charAt(0)}
                                  </div>
                                  <div className="font-semibold text-slate-900 dark:text-white">{record.student?.user?.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                {new Date(record.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                  record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                  {record.status === 'present' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Users className="h-8 w-8" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">Waiting for first student to check in...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorAttendance;
