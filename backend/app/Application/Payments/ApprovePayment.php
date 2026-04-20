<?php

namespace App\Application\Payments;

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

        $this->paymentRepository->updateStatus($payment, 'approved', $adminId);

        // Dispatch Event for Enrollment Creation
        event(new PaymentApproved($payment));

        return $payment;
    }
}
