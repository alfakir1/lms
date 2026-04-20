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

    public function index()
    {
        $payments = $this->paymentRepo->listByUserPaginated(Auth::id());
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'amount' => 'required|numeric|min:0',
            'proof_file' => 'nullable|image|max:5000',
        ]);

        try {
            $payment = $this->createPaymentUseCase->execute(
                Auth::id(),
                $request->course_id,
                $request->amount,
                $request->file('proof_file')
            );
            return response()->json($payment, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
