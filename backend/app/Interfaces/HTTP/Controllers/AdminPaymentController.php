<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Payments\ApprovePayment;
use App\Application\Payments\RejectPayment;
use App\Application\Interfaces\PaymentRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class AdminPaymentController extends Controller
{
    private ApprovePayment $approvePaymentUseCase;
    private RejectPayment $rejectPaymentUseCase;
    private PaymentRepositoryInterface $paymentRepo;

    public function __construct(
        ApprovePayment $approvePaymentUseCase,
        RejectPayment $rejectPaymentUseCase,
        PaymentRepositoryInterface $paymentRepo
    ) {
        $this->approvePaymentUseCase = $approvePaymentUseCase;
        $this->rejectPaymentUseCase = $rejectPaymentUseCase;
        $this->paymentRepo = $paymentRepo;
    }

    public function index()
    {
        $payments = $this->paymentRepo->listAllPaginated(20);
        return response()->json($payments);
    }

    public function approve($id)
    {
        // Add auth check for Admin or Super Admin
        $user = Auth::user();
        if (!$user->isRole('admin') && !$user->isRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $payment = $this->approvePaymentUseCase->execute($id, $user->id);
            return response()->json(['message' => 'Payment approved successfully', 'payment' => $payment]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function reject($id)
    {
        $user = Auth::user();
        if (!$user->isRole('admin') && !$user->isRole('super_admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $payment = $this->rejectPaymentUseCase->execute($id, $user->id);
            return response()->json(['message' => 'Payment rejected successfully', 'payment' => $payment]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
