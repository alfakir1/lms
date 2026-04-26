<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Assignment::with('course');

        if ($user->role === 'student') {
            $studentId = $user->student->id ?? 0;
            $query->whereHas('course.enrollments', function($q) use ($studentId) {
                $q->where('student_id', $studentId);
            });
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            $query->whereHas('course', function($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'instructor') abort(403);

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'total_points' => 'required|integer',
        ]);

        $assignment = Assignment::create($validated);
        return response()->json($assignment, 201);
    }
}
