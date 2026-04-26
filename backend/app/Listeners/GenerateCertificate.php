<?php

namespace App\Listeners;

use App\Events\CourseCompleted;
use App\Models\Certificate;
use App\Models\Attendance;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class GenerateCertificate implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(CourseCompleted $event): void
    {
        $enrollment = $event->enrollment;

        // 1. Idempotency Check: IF certificate EXISTS (student_id + course_id) -> STOP
        $exists = Certificate::where('student_id', $enrollment->student_id)
            ->where('course_id', $enrollment->course_id)
            ->exists();

        if ($exists) {
            Log::info("Certificate already exists for Student: {$enrollment->student_id}, Course: {$enrollment->course_id}");
            return;
        }

        // 2. Attendance Validation (Threshold >= 80%)
        $totalSessions = Attendance::where('student_id', $enrollment->student_id)
            ->where('course_id', $enrollment->course_id)
            ->count();
        
        if ($totalSessions === 0) {
            Log::warning("No attendance records for Student: {$enrollment->student_id} in Course: {$enrollment->course_id}");
            return;
        }

        $presentCount = Attendance::where('student_id', $enrollment->student_id)
            ->where('course_id', $enrollment->course_id)
            ->whereIn('status', ['present', 'late'])
            ->count();

        $percentage = ($presentCount / $totalSessions) * 100;

        if ($percentage < 80) {
            Log::info("Student: {$enrollment->student_id} did not meet attendance threshold (Current: {$percentage}%)");
            return;
        }

        // 3. Generate Certificate
        Certificate::create([
            'student_id' => $enrollment->student_id,
            'course_id' => $enrollment->course_id,
            'file_url' => 'certificates/' . uniqid('cert_') . '.pdf', // Placeholder for actual PDF gen
            'issued_at' => now(),
        ]);

        Log::info("Certificate generated for Student: {$enrollment->student_id}");
    }
}
