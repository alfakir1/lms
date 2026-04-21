<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Application\Enrollment\EnrollmentService;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EnrollmentController extends Controller
{
    public function __construct(private EnrollmentService $enrollmentService) {}

    /** Student: request enrollment in a course */
    public function enroll(Request $request, Course $course)
    {
        $user = $request->user();

        try {
            // Service expects Student entity usually, but here we might need to update the service too.
            // For now, let's keep it consistent with the user_id change.
            $enrollment = $this->enrollmentService->enroll($user, $course);
            return $this->apiResponse('success', $enrollment, 'Enrollment request submitted', 201);
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 422);
        }
    }

    public function pending(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $enrollments = Enrollment::with(['user', 'course'])
            ->where('status', 'pending')
            ->latest()
            ->paginate($perPage);

        return $this->apiResponse('success', $enrollments);
    }

    /** Admin: approve an enrollment */
    public function approve(Enrollment $enrollment)
    {
        $enrollment = $this->enrollmentService->approve($enrollment);
        return $this->apiResponse('success', $enrollment, 'Enrollment approved');
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
        $user = $request->user();
        $enrollments = Enrollment::with('course')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return $this->apiResponse('success', $enrollments);
    }
}
