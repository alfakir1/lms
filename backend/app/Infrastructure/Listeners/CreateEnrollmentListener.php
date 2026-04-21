<?php

namespace App\Infrastructure\Listeners;

use App\Application\Events\PaymentApproved;
use App\Infrastructure\Persistence\Models\Enrollment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Facades\Log;

class CreateEnrollmentListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(PaymentApproved $event): void
    {
        $payment = $event->payment;
        
        try {
            Log::info('Enrollment creation started', [
                'user_id' => $payment->user_id,
                'course_id' => $payment->course_id,
                'payment_id' => $payment->id
            ]);

            $enrollment = Enrollment::firstOrCreate([
                'user_id' => $payment->user_id,
                'course_id' => $payment->course_id,
            ], [
                'status' => 'approved',
                'enrolled_at' => now(),
            ]);

            if ($enrollment->wasRecentlyCreated) {
                Log::info('Enrollment created successfully', ['enrollment_id' => $enrollment->id]);
            } else {
                Log::warning('Enrollment already exists, potential duplicate request caught', [
                    'user_id' => $payment->user_id,
                    'course_id' => $payment->course_id
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Failed to create enrollment', [
                'error' => $e->getMessage(),
                'payment_id' => $payment->id
            ]);
            throw $e;
        }
    }
}
