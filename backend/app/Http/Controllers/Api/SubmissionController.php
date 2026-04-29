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
        $query = Submission::with(['assignment.course', 'student.user']);

        if ($assignmentId) {
            $query->where('assignment_id', $assignmentId);
        }

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            $query->whereHas('assignment.course', function($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('submitted_at', 'desc')->get()
        ]);
    }

    public function show(Submission $submission)
    {
        $user = auth()->user();
        // Authorization
        if ($user->role === 'student' && $submission->student_id !== $user->student->id) abort(403);
        if ($user->role === 'instructor' && $submission->assignment->course->instructor_id !== $user->instructor->id) abort(403);

        return response()->json([
            'success' => true,
            'data' => $submission->load(['assignment', 'student.user'])
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $validated = $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'file' => 'nullable|file|max:51200', // 50MB
            'content' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $assignment = \App\Models\Assignment::findOrFail($validated['assignment_id']);
        
        // Check deadline
        if ($assignment->deadline && \Carbon\Carbon::parse($assignment->deadline)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'لقد انتهى موعد التسليم لهذه المهمة.'
            ], 422);
        }

        $data = [
            'assignment_id' => $validated['assignment_id'],
            'student_id' => $user->student->id,
            'content' => $validated['content'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'submitted',
            'submitted_at' => now(),
        ];

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            $data['file_url'] = asset('storage/' . $path);
        }

        // Check if already submitted (re-submission support)
        $submission = Submission::where('assignment_id', $validated['assignment_id'])
                                ->where('student_id', $user->student->id)
                                ->first();

        if ($submission) {
            // Re-submission: delete old file if exists
            if ($submission->file_url && $request->hasFile('file') && str_contains($submission->file_url, '/storage/submissions/')) {
                $oldPath = str_replace(asset('storage/'), '', $submission->file_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $submission->update($data);
        } else {
            $submission = Submission::create($data);
        }

        // Notify Instructor
        if ($assignment->course && $assignment->course->instructor_id) {
            $instructor = \App\Models\Instructor::with('user')->find($assignment->course->instructor_id);
            if ($instructor && $instructor->user) {
                \App\Models\Notification::create([
                    'user_id' => $instructor->user->id,
                    'type' => 'assignment_submitted',
                    'title' => 'تسليم جديد: ' . $assignment->title,
                    'message' => 'قام الطالب ' . $user->name . ' بتسليم المهمة.',
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $submission
        ], 201);
    }

    public function grade(Request $request, Submission $submission)
    {
        $user = $request->user();
        if ($user->role !== 'instructor' && $user->role !== 'admin') abort(403);

        if ($user->role === 'instructor' && $submission->assignment->course->instructor_id !== $user->instructor->id) {
            abort(403);
        }

        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:' . ($submission->assignment->max_grade ?? 100),
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'status' => 'graded',
        ]);

        // Notify Student
        if ($submission->student && $submission->student->user) {
            \App\Models\Notification::create([
                'user_id' => $submission->student->user->id,
                'type' => 'assignment_graded',
                'title' => 'تم رصد درجة المهمة: ' . $submission->assignment->title,
                'message' => 'لقد حصلت على ' . $validated['grade'] . ' من ' . $submission->assignment->max_grade,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $submission
        ]);
    }
}
