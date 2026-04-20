<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Application\Enrollment\EnrollmentService;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class EnrollmentController extends Controller
{
    public function __construct(private EnrollmentService $enrollmentService) {}

    /** Student: request enrollment in a course */
    public function enroll(Request $request, Course $course)
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Only students can enroll.'], 403);
        }

        try {
            $enrollment = $this->enrollmentService->enroll($student, $course);
            return response()->json(['message' => 'Enrollment request submitted.', 'enrollment' => $enrollment], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Admin: list all pending enrollments */
    public function pending()
    {
        $enrollments = Enrollment::with(['student.user', 'course'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($enrollments);
    }

    /** Admin: approve an enrollment */
    public function approve(Enrollment $enrollment)
    {
        $enrollment = $this->enrollmentService->approve($enrollment);
        return response()->json(['message' => 'Enrollment approved.', 'enrollment' => $enrollment]);
    }

    /** Admin: ban a student from a course */
    public function ban(Request $request, Enrollment $enrollment)
    {
        $data = $request->validate([
            'reason'        => 'required|string',
            'document'      => 'nullable|file|mimes:pdf,jpg,png|max:5120',
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('ban_documents');
        }

        $enrollment = $this->enrollmentService->ban($enrollment, $data['reason'], $documentPath);

        return response()->json(['message' => 'Student banned from course.', 'enrollment' => $enrollment]);
    }

    /** Student: view own enrollments */
    public function myEnrollments(Request $request)
    {
        $student = $request->user()->student;
        $enrollments = Enrollment::with('course')
            ->where('student_id', $student->id)
            ->latest()
            ->get();

        return response()->json($enrollments);
    }
}
