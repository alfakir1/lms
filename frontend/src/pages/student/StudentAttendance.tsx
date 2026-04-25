import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollmentService';
import { attendanceService } from '../../services/attendanceService';
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  Camera,
  Keyboard
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const StudentAttendance: React.FC = () => {
  const { t } = useTranslation();
  const [manualToken, setManualToken] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  // Get active enrollments to find potential sessions
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  // For simplicity in this demo, we assume there's one active session nearby
  // In a real app, we might search for sessions via geolocation or course selection
  const activeEnrollments = enrollments?.filter(e => e.status === 'active') || [];

  const requestTokenMutation = useMutation({
    mutationFn: (sessionId: number) => attendanceService.requestToken(sessionId),
    onSuccess: (data: any) => {
      showSuccess('Ready! Scan the QR code on the instructor screen.');
      setIsScanning(true);
    },
    onError: (err: any) => {
      showError(err?.message || 'Failed to initialize attendance');
    },
  });

  const scanTokenMutation = useMutation({
    mutationFn: (token: string) => attendanceService.scanToken(token),
    onSuccess: () => {
      showSuccess('Attendance recorded successfully!');
      setIsScanning(false);
      setManualToken('');
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    },
    onError: (err: any) => {
      showError(err?.message || 'Invalid or expired token');
    },
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    scanTokenMutation.mutate(manualToken.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <QrCode className="text-primary-600 h-8 w-8" />
            Attendance Check-In
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Confirm your presence in your active classes.
          </p>
        </div>

        {isScanning ? (
          <Card className="dark:bg-slate-900 border-primary-200 dark:border-primary-800 shadow-glow-primary">
            <CardContent className="p-8 text-center">
              <div className="relative w-64 h-64 mx-auto mb-8 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-primary-500/30">
                 <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent animate-scan-line"></div>
                 <Camera className="h-16 w-16 text-primary-500 opacity-20" />
                 <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"></div>
                 <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"></div>
                 <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"></div>
                 <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg"></div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Scan QR Code</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                Align the QR code on the instructor's screen within the frame to check in.
              </p>

              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="Or enter code manually"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white text-sm"
                   />
                   <Button type="submit" size="sm" isLoading={scanTokenMutation.isPending}>
                      Apply
                   </Button>
                </form>
                <Button variant="ghost" onClick={() => setIsScanning(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card className="dark:bg-slate-900 border-0 shadow-soft overflow-hidden">
              <div className="p-6 bg-slate-900 text-white">
                <h3 className="text-lg font-bold">Active Sessions</h3>
                <p className="text-sm text-slate-400">Available classes for check-in right now.</p>
              </div>
              <CardContent className="p-6">
                {isLoadingEnrollments ? (
                  <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 text-primary-600 animate-spin" /></div>
                ) : activeEnrollments.length > 0 ? (
                  <div className="space-y-4">
                    {activeEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900 transition-all bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                              {enrollment.course?.title?.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{enrollment.course?.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  <Clock className="h-3 w-3" />
                                  Check-in open
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  <MapPin className="h-3 w-3" />
                                  In-Person
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => requestTokenMutation.mutate(enrollment.course_id)} isLoading={requestTokenMutation.isPending && requestTokenMutation.variables === enrollment.course_id}>
                            Check In
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">No Active Sessions</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">There are no attendance sessions currently open for your courses.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="dark:bg-slate-900 border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 rounded-lg">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Smart Verification</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our system uses dynamic QR codes and periodic refreshes to ensure secure, proximity-based attendance.
                  </p>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-900 border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Attendance History</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    View your complete attendance record and track your class participation percentage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
