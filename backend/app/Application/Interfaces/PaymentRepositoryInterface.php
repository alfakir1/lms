<?php

namespace App\Application\Interfaces;

use App\Infrastructure\Persistence\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

interface PaymentRepositoryInterface
{
    public function create(array $data): Payment;
    
    public function findById(int $id): ?Payment;
    
    public function findPendingByUserAndCourse(int $userId, int $courseId): ?Payment;

    public function findLatestByUserAndCourse(int $userId, int $courseId): ?Payment;
    
    public function updateStatus(Payment $payment, string $status, ?int $reviewedBy = null): bool;
    
    public function listAllPaginated(int $perPage = 15);

    public function listByUserPaginated(int $userId, int $perPage = 15);
}
