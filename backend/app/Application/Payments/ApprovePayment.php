<?php

namespace App\Application\Payments;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Application\Interfaces\PaymentRepositoryInterface;
use App\Application\Events\PaymentApproved;

class ApprovePayment
{
    private PaymentRepositoryInterface $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function execute(int $paymentId, int $adminId)
    {
        $payment = $this->paymentRepository->findById($paymentId);
        if (!$payment) {
            throw new \Exception('Payment not found.');
        }

        if ($payment->status === 'approved') {
            throw new \Exception('Payment is already approved.');
        }

        if (!in_array($payment->status, ['pending', 'under_review'])) {
            throw new \Exception('Invalid payment state');
        }

        DB::transaction(function () use ($payment, $adminId) {
            $this->paymentRepository->updateStatus($payment, 'approved', $adminId);

            // Dispatch Event for Enrollment Creation
            event(new PaymentApproved($payment));
        });

        Log::info('Payment approved', ['payment_id' => $paymentId, 'admin_id' => $adminId, 'user_id' => $payment->user_id]);

        return $payment;
    }
}
