<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index(Request $request, $assignmentId = null)
    {
        $user = $request->user();
        $query = Submission::with(['assignment', 'student.user']);

        if ($assignmentId) {
            $query->where('assignment_id', $assignmentId);
        }

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'student') abort(403);

        $validated = $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'file' => 'required|file|max:10240', // max 10MB
            'notes' => 'nullable|string',
        ]);

        $path = $request->file('file')->store('submissions');

        $submission = Submission::create([
            'assignment_id' => $validated['assignment_id'],
            'student_id' => $request->user()->student->id,
            'file_url' => '/storage/' . $path,
            'notes' => $validated['notes'] ?? null,
            'status' => 'submitted',
        ]);

        return response()->json($submission, 201);
    }

    public function grade(Request $request, Submission $submission)
    {
        if ($request->user()->role !== 'instructor') abort(403);

        $validated = $request->validate([
            'grade' => 'required|numeric',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'status' => 'graded',
        ]);

        return response()->json($submission);
    }
}
