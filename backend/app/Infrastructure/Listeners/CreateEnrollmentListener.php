<?php

namespace App\Infrastructure\Listeners;

use App\Application\Events\PaymentApproved;
use App\Infrastructure\Persistence\Models\Enrollment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateEnrollmentListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(PaymentApproved $event): void
    {
        $payment = $event->payment;
        
        // Prevent duplicate enrollment
        $exists = Enrollment::where('student_id', $payment->user_id)
            ->where('course_id', $payment->course_id)
            ->exists();
            
        if (!$exists) {
            Enrollment::create([
                'student_id' => $payment->user_id,
                'course_id' => $payment->course_id,
                'status' => 'approved',
                'enrolled_at' => now(),
            ]);
        }
    }
}
