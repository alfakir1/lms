<?php

namespace App\Listeners;

use App\Events\PaymentApproved;
use App\Events\EnrollmentCreated;
use App\Models\Enrollment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateEnrollment implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(PaymentApproved $event): void
    {
        $payment = $event->payment;

        DB::transaction(function () use ($payment) {
            // Idempotency check: Ensure enrollment doesn't already exist
            $existing = Enrollment::where('student_id', $payment->student_id)
                ->where('course_id', $payment->course_id)
                ->first();

            if ($existing) {
                Log::info("Enrollment already exists for Student: {$payment->student_id}, Course: {$payment->course_id}");
                return;
            }

            $enrollment = Enrollment::create([
                'student_id' => $payment->student_id,
                'course_id' => $payment->course_id,
                'status' => 'active',
                'payment_status' => 'paid',
                'enrolled_at' => now(),
            ]);

            // Trigger EnrollmentCreated for further automation (Attendance, etc.)
            event(new EnrollmentCreated($enrollment));
        });
    }
}
