<?php

namespace App\Application\Attendance;

use App\Infrastructure\Persistence\Models\AttendanceSession;
use App\Infrastructure\Persistence\Models\Attendance;
use App\Infrastructure\Persistence\Models\QrToken;
use App\Infrastructure\Persistence\Models\Student;
use App\Infrastructure\Persistence\Models\Instructor;
use App\Infrastructure\Persistence\Models\Course;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    // QR Token valid for 60 seconds
    private const TOKEN_TTL_SECONDS = 60;

    // Redis lock TTL (slightly longer than token to allow cleanup)
    private const LOCK_TTL_SECONDS = 65;

    /**
     * Instructor starts a new attendance session.
     */
    public function startSession(Instructor $instructor, Course $course): AttendanceSession
    {
        // Close any lingering open session for this course
        AttendanceSession::where('course_id', $course->id)
            ->where('instructor_id', $instructor->id)
            ->where('status', 'active')
            ->update(['status' => 'closed', 'end_time' => now()]);

        return AttendanceSession::create([
            'course_id'    => $course->id,
            'instructor_id' => $instructor->id,
            'start_time'   => now(),
            'status'       => 'active',
        ]);
    }

    /**
     * Student requests attendance (after biometric success on mobile).
     * This implements the Atomic Locking strategy.
     *
     * Returns the generated QR token string (to display on instructor screen).
     */
    public function requestQrToken(AttendanceSession $session, Student $student): string
    {
        if ($session->status !== 'active') {
            throw new \Exception('Attendance session is not active.');
        }

        $lockKey = "attendance_lock:session:{$session->id}";

        // Try to acquire lock atomically (Redis-backed)
        $lock = Cache::lock($lockKey, self::LOCK_TTL_SECONDS);

        if (! $lock->get()) {
            throw new \Exception('Another student is currently completing attendance. Please wait.');
        }

        try {
            // Invalidate any existing unused token for this session
            QrToken::where('session_id', $session->id)
                ->where('is_used', false)
                ->delete();

            // Generate a cryptographically secure unique token
            $tokenString = Str::uuid()->toString();

            QrToken::create([
                'session_id' => $session->id,
                'token'      => $tokenString,
                'expires_at' => now()->addSeconds(self::TOKEN_TTL_SECONDS),
                'is_used'    => false,
            ]);

            return $tokenString;

        } catch (\Throwable $e) {
            $lock->release();
            throw $e;
        }

        // Lock is NOT released here — it stays until the student scans or times out
        // The lock is released in scanQrToken() or handleTimeout()
    }

    /**
     * Student scans the QR code displayed on instructor screen.
     * Phase 5: Scan & Invalidate.
     */
    public function scanQrToken(string $tokenString, Student $student): Attendance
    {
        return DB::transaction(function () use ($tokenString, $student) {
            $token = QrToken::where('token', $tokenString)
                ->where('is_used', false)
                ->lockForUpdate()
                ->first();

            if (! $token) {
                throw new \Exception('Invalid or already used QR token.');
            }

            if ($token->isExpired()) {
                $this->releaseLock($token->session_id);
                throw new \Exception('QR token has expired.');
            }

            // Mark token as used immediately (Invalidation)
            $token->update(['is_used' => true]);

            // Record attendance
            $attendance = Attendance::create([
                'session_id' => $token->session_id,
                'student_id' => $student->id,
                'status'     => 'present',
                'timestamp'  => now(),
            ]);

            // Release the lock to allow the next student
            $this->releaseLock($token->session_id);

            return $attendance;
        });
    }

    /**
     * Handle timeout — expires the token and releases the lock.
     * Called by a scheduled job or webhook after TOKEN_TTL_SECONDS.
     */
    public function handleTimeout(AttendanceSession $session): void
    {
        QrToken::where('session_id', $session->id)
            ->where('is_used', false)
            ->delete();

        $this->releaseLock($session->id);
    }

    /**
     * Instructor manually records an absent or excused student.
     */
    public function recordManual(
        AttendanceSession $session,
        Student $student,
        string $status, // 'absent' | 'excused' | 'manual'
        ?string $reason = null
    ): Attendance {
        return Attendance::updateOrCreate(
            ['session_id' => $session->id, 'student_id' => $student->id],
            ['status' => $status, 'timestamp' => now()]
        );
    }

    /**
     * Close an attendance session.
     */
    public function closeSession(AttendanceSession $session): void
    {
        $session->update(['status' => 'closed', 'end_time' => now()]);
    }

    /* ---------- Private Helpers ---------- */

    private function releaseLock(int $sessionId): void
    {
        Cache::lock("attendance_lock:session:{$sessionId}")->forceRelease();
    }
}
