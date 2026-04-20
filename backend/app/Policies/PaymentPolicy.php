<?php

namespace App\Policies;

use App\Infrastructure\Persistence\Models\Payment;
use App\Infrastructure\Persistence\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment)
    {
        return $user->id === $payment->user_id || $user->isRole('admin') || $user->isRole('super_admin');
    }
}
