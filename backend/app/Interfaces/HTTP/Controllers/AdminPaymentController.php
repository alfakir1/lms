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

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $payments = $this->paymentRepo->listAllPaginated($perPage);
        return $this->apiResponse('success', $payments, 'All payments retrieved successfully');
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
            return $this->apiResponse('success', $payment, 'Payment approved successfully');
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 400);
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
            return $this->apiResponse('success', $payment, 'Payment rejected successfully');
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 400);
        }
    }
}
