<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Application\Attendance\AttendanceService;
use App\Infrastructure\Persistence\Models\AttendanceSession;
use App\Infrastructure\Persistence\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceService $attendanceService) {}

    /** Instructor: start a new attendance session */
    public function startSession(Request $request, Course $course)
    {
        $instructor = $request->user()->instructor;

        if (! $instructor) {
            return response()->json(['message' => 'Only instructors can start sessions.'], 403);
        }

        $session = $this->attendanceService->startSession($instructor, $course);

        return response()->json([
            'message' => 'Attendance session started. Waiting for student requests.',
            'session' => $session,
        ], 201);
    }

    /**
     * Student: request QR token after biometric success.
     * Returns the token to be displayed on instructor screen via WebSocket.
     */
    public function requestToken(Request $request, AttendanceSession $session)
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Only students can request tokens.'], 403);
        }

        try {
            $token = $this->attendanceService->requestQrToken($session, $student);

            return response()->json([
                'message' => 'QR token generated. Please scan within 60 seconds.',
                'token'   => $token,
                'expires_at' => now()->addSeconds(60)->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 429);
        }
    }

    /** Student: scan the QR code displayed on instructor screen */
    public function scanToken(Request $request)
    {
        $data = $request->validate(['token' => 'required|string']);
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Only students can scan tokens.'], 403);
        }

        try {
            $attendance = $this->attendanceService->scanQrToken($data['token'], $student);

            return response()->json([
                'message'    => 'Attendance recorded successfully.',
                'attendance' => $attendance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Instructor: manually record absent/excused/manual attendance */
    public function recordManual(Request $request, AttendanceSession $session)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'status'     => 'required|in:absent,excused,manual',
            'reason'     => 'nullable|string',
        ]);

        $student = \App\Infrastructure\Persistence\Models\Student::findOrFail($data['student_id']);

        $attendance = $this->attendanceService->recordManual(
            $session,
            $student,
            $data['status'],
            $data['reason'] ?? null
        );

        return response()->json(['message' => 'Attendance recorded manually.', 'attendance' => $attendance]);
    }

    /** Instructor: close session */
    public function closeSession(AttendanceSession $session)
    {
        $this->attendanceService->closeSession($session);
        return response()->json(['message' => 'Session closed.']);
    }

    /** Get attendance report for a session */
    public function sessionReport(AttendanceSession $session)
    {
        $session->load('activeToken');
        $records = $session->attendanceRecords()->with('student.user')->orderBy('timestamp', 'desc')->get();
        return response()->json(['session' => $session, 'records' => $records]);
    }
}
