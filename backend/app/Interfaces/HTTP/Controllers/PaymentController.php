<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Payments\CreatePaymentRequest;
use App\Application\Interfaces\PaymentRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    private CreatePaymentRequest $createPaymentUseCase;
    private PaymentRepositoryInterface $paymentRepo;

    public function __construct(
        CreatePaymentRequest $createPaymentUseCase,
        PaymentRepositoryInterface $paymentRepo
    ) {
        $this->createPaymentUseCase = $createPaymentUseCase;
        $this->paymentRepo = $paymentRepo;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $payments = $this->paymentRepo->listByUserPaginated(Auth::id(), $perPage);
        return $this->apiResponse('success', $payments, 'Payments retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'amount' => 'required|numeric|min:0',
            'proof_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5000',
        ]);

        try {
            $payment = $this->createPaymentUseCase->execute(
                Auth::id(),
                $request->course_id,
                $request->amount,
                $request->file('proof_file')
            );
            return $this->apiResponse('success', $payment, 'Payment request submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 400);
        }
    }
}
