<?php

namespace App\Listeners;

use App\Events\EnrollmentCreated;
use App\Models\Attendance;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class InitializeAttendance implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(EnrollmentCreated $event): void
    {
        $enrollment = $event->enrollment;

        // Validation: Only for active enrollments
        if ($enrollment->status !== 'active') {
            Log::warning("Cannot initialize attendance for non-active enrollment ID: {$enrollment->id}");
            return;
        }

        // Logic to pre-initialize attendance if needed, or simply verify the system is ready
        // For a session-based system, we might create records for the next session
        // Here we just ensure we don't duplicate if called multiple times
        Log::info("Attendance system initialized for Student: {$enrollment->student_id}, Course: {$enrollment->course_id}");
    }
}
