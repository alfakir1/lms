<?php

namespace App\Application\Payments;

use App\Application\Interfaces\PaymentRepositoryInterface;

class RejectPayment
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
            throw new \Exception('Payment is already approved, cannot reject.');
        }

        $this->paymentRepository->updateStatus($payment, 'rejected', $adminId);

        return $payment;
    }
}
