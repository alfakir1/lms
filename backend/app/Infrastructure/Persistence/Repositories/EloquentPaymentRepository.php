<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Application\Interfaces\PaymentRepositoryInterface;
use App\Infrastructure\Persistence\Models\Payment;
use Carbon\Carbon;

class EloquentPaymentRepository implements PaymentRepositoryInterface
{
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }
    
    public function findById(int $id): ?Payment
    {
        return Payment::find($id);
    }
    
    public function findPendingByUserAndCourse(int $userId, int $courseId): ?Payment
    {
        return Payment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', 'pending')
            ->first();
    }

    public function findLatestByUserAndCourse(int $userId, int $courseId): ?Payment
    {
        return Payment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->latest()
            ->first();
    }
    
    public function updateStatus(Payment $payment, string $status, ?int $reviewedBy = null): bool
    {
        $payment->status = $status;
        if ($reviewedBy) {
            $payment->reviewed_by = $reviewedBy;
            $payment->reviewed_at = Carbon::now();
        }
        return $payment->save();
    }
    
    public function listAllPaginated(int $perPage = 15)
    {
        return Payment::with(['user', 'course'])->latest()->paginate($perPage);
    }
    
    public function listByUserPaginated(int $userId, int $perPage = 15)
    {
        return Payment::with(['course'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }
}
