<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Enrollment;
use App\Events\PaymentApproved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payment::with(['student.user', 'course']);

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        }

        $payments = $query->orderBy('created_at', 'desc')->get();

        // Map to a unified shape the frontend expects
        $payments = $payments->map(function ($p) {
            return [
                'id'             => $p->id,
                'student_id'     => $p->student_id,
                'course_id'      => $p->course_id,
                'amount'         => $p->amount,
                'payment_method' => $p->method,
                'payment_date'   => $p->paid_at ?? $p->created_at,
                'transaction_id' => $p->transaction_id,
                'status'         => $p->status,
                'created_at'     => $p->created_at,
                'student'        => $p->student ? [
                    'id'   => $p->student->id,
                    'user' => $p->student->user ? [
                        'id'   => $p->student->user->id,
                        'name' => $p->student->user->name,
                    ] : null,
                ] : null,
                'course'         => $p->course ? [
                    'id'    => $p->course->id,
                    'title' => $p->course->title,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'reception'])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'student_id'     => 'required|exists:students,id',
            'course_id'      => 'required|exists:courses,id',
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'status'         => 'sometimes|string|in:pending,completed,failed,paid',
        ]);

        $status = $validated['status'] ?? 'completed';
        // Normalize 'paid' to 'completed' for DB
        if ($status === 'paid') $status = 'completed';

        $payment = Payment::create([
            'student_id'     => $validated['student_id'],
            'course_id'      => $validated['course_id'],
            'amount'         => $validated['amount'],
            'method'         => $validated['payment_method'],
            'status'         => $status,
            'paid_at'        => now(),
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
        ]);

        if (!Enrollment::where('course_id', $validated['course_id'])
                        ->where('student_id', $validated['student_id'])->exists()) {
            Enrollment::create([
                'course_id'      => $validated['course_id'],
                'student_id'     => $validated['student_id'],
                'status'         => 'active',
                'payment_status' => 'paid',
            ]);
        }

        $payment->load(['student.user', 'course']);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'             => $payment->id,
                'student_id'     => $payment->student_id,
                'course_id'      => $payment->course_id,
                'amount'         => $payment->amount,
                'payment_method' => $payment->method,
                'payment_date'   => $payment->paid_at,
                'transaction_id' => $payment->transaction_id,
                'status'         => $payment->status,
                'created_at'     => $payment->created_at,
                'student'        => $payment->student ? [
                    'id'   => $payment->student->id,
                    'user' => $payment->student->user,
                ] : null,
                'course'         => $payment->course,
            ],
        ], 201);
    }

    public function approve(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $payment = Payment::findOrFail($id);

        if ($payment->status === 'completed') {
            return response()->json([
                'success' => true,
                'message' => 'Payment already completed',
                'data'    => $payment,
            ]);
        }

        DB::transaction(function () use ($payment) {
            $payment->update([
                'status'  => 'completed',
                'paid_at' => now(),
            ]);

            event(new PaymentApproved($payment));
        });

        return response()->json([
            'success' => true,
            'data'    => $payment,
        ]);
    }
}

