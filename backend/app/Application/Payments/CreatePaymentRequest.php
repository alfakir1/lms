<?php

namespace App\Application\Payments;

use App\Application\Interfaces\PaymentRepositoryInterface;
use App\Application\Interfaces\StorageServiceInterface;
use App\Application\Enrollment\EnrollmentService;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\User;
use Illuminate\Support\Str;

class CreatePaymentRequest
{
    private PaymentRepositoryInterface $paymentRepository;
    private StorageServiceInterface $storageService;
    private EnrollmentService $enrollmentService;

    public function __construct(
        PaymentRepositoryInterface $paymentRepository,
        StorageServiceInterface $storageService,
        EnrollmentService $enrollmentService
    )
    {
        $this->paymentRepository = $paymentRepository;
        $this->storageService = $storageService;
        $this->enrollmentService = $enrollmentService;
    }

    public function execute(int $userId, int $courseId, $proofFile = null)
    {
        // First check if pending exists to avoid duplicates
        $existing = $this->paymentRepository->findPendingByUserAndCourse($userId, $courseId);
        if ($existing) {
            throw new \Exception('A pending payment already exists for this course.');
        }

        $user = User::findOrFail($userId);
        $course = Course::findOrFail($courseId);

        // Server is source of truth for amount (includes discounts if applicable)
        $amount = $this->enrollmentService->calculatePrice($user, $course);

        $proofPath = null;
        if ($proofFile) {
            $path = 'payments/proofs/' . Str::uuid() . '.' . $proofFile->getClientOriginalExtension();
            $proofPath = $this->storageService->uploadFile($path, file_get_contents($proofFile->getRealPath()));
        }

        $referenceCode = 'PAY-' . strtoupper(Str::random(8));

        return $this->paymentRepository->create([
            'user_id' => $userId,
            'course_id' => $courseId,
            'amount' => $amount,
            'payment_method' => 'cash',
            'status' => 'pending',
            'proof_image' => $proofPath,
            'reference_code' => $referenceCode,
        ]);
    }
}
