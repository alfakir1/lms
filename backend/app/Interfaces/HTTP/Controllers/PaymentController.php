<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Payments\CreatePaymentRequest;
use App\Application\Interfaces\PaymentRepositoryInterface;
use App\Infrastructure\Persistence\Models\Course;
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

        $query = \App\Infrastructure\Persistence\Models\Payment::with(['course'])
            ->where('user_id', Auth::id())
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->input('course_id'));
        }

        $payments = $query->paginate($perPage);
        return $this->apiResponse('success', $payments, 'Payments retrieved successfully');
    }

    /**
     * Return the latest payment for the authenticated user for a specific course.
     * Used for per-course enrollment/payment status UI.
     */
    public function latestForCourse(Request $request, Course $course)
    {
        $payment = $this->paymentRepo->findLatestByUserAndCourse(Auth::id(), $course->id);
        if ($payment) {
            $payment->load('course');
        }

        return $this->apiResponse('success', $payment, 'Latest payment retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'proof_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5000',
        ]);

        try {
            $payment = $this->createPaymentUseCase->execute(
                Auth::id(),
                $request->course_id,
                $request->file('proof_file')
            );
            return $this->apiResponse('success', $payment, 'Payment request submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 400);
        }
    }
}
