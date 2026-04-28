<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Enrollment::with(['course', 'student.user']);

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            $query->whereHas('course', function($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }


        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'student_id' => 'sometimes|exists:students,id',
        ]);

        if ($user->role === 'student') {
            $validated['student_id'] = $user->student->id;
        } else {
            if (!in_array($user->role, ['admin', 'reception'])) {
                abort(403, 'Unauthorized to enroll others.');
            }
            if (!isset($validated['student_id'])) {
                abort(422, 'student_id is required.');
            }
        }

        // Check if already enrolled
        if (Enrollment::where('course_id', $validated['course_id'])->where('student_id', $validated['student_id'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Already enrolled'
            ], 422);
        }

        $enrollment = Enrollment::create([
            'course_id'      => $validated['course_id'],
            'student_id'     => $validated['student_id'],
            'status'         => 'active',
            'payment_status' => 'unpaid',
        ]);

        return response()->json([
            'success' => true,
            'data' => $enrollment
        ], 201);
    }
}
